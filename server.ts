import express from 'express';
import path from 'path';
import { SchemaValidator } from './schema';
import { 
  runAgent, 
  analyzeDocument, 
  analyzeVDRDocument, 
  queryVDR, 
  suggestTasksFromDocument, 
  analyzeCommentForRisks, 
  getAIRecommendations, 
  suggestDealTasks, 
  getLenderMatches, 
  analyzeQoE, 
  getIndustryMultiple 
} from './services/geminiService';
import { 
  initialDeals, 
  initialComments, 
  initialTasks, 
  initialDocuments 
} from './data';
import { Deal, Comment, Task, SharedDocument } from './types';

// Ensure the standard API key is set in process.env for geminiService
process.env.API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

async function startServer() {
  console.log("Starting server...");
  const app = express();
  const PORT = 3000;
  console.log(`Environment: ${process.env.NODE_ENV}`);

  // Middleware for parsing JSON requests with increased limit for base64 PDFs
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // In-memory data store for persistent storage during the dev server lifetime
  let serverDeals: Deal[] = JSON.parse(JSON.stringify(initialDeals));
  let serverComments: Comment[] = JSON.parse(JSON.stringify(initialComments));
  let serverTasks: Task[] = JSON.parse(JSON.stringify(initialTasks));
  let serverDocuments: SharedDocument[] = JSON.parse(JSON.stringify(initialDocuments));

  // --- API Routes ---

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', api_key_configured: !!process.env.API_KEY });
  });

  // 2. Deals CRUD APIs
  app.get('/api/deals', (req, res) => {
    res.json(serverDeals);
  });

  app.post('/api/deals', (req, res) => {
    try {
      const validated = SchemaValidator.validateDeal(req.body);
      const newDeal: Deal = {
        ...validated,
        id: validated.id || Date.now(),
      };
      serverDeals.unshift(newDeal);
      res.status(201).json(newDeal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put('/api/deals/:id', (req, res) => {
    try {
      const id = Number(req.params.id);
      const index = serverDeals.findIndex(d => d.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Deal not found' });
      }
      const validated = SchemaValidator.validateDeal(req.body);
      serverDeals[index] = {
        ...validated,
        id, // maintain original ID
      };
      res.json(serverDeals[index]);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete('/api/deals/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = serverDeals.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    serverDeals.splice(index, 1);
    res.json({ success: true, message: `Deal ${id} deleted successfully` });
  });

  // 3. Comments CRUD APIs
  app.get('/api/comments', (req, res) => {
    res.json(serverComments);
  });

  app.post('/api/comments', async (req, res) => {
    try {
      const comment: Comment = req.body;
      const newComment: Comment = {
        ...comment,
        id: comment.id || Date.now(),
        timestamp: comment.timestamp || new Date().toISOString()
      };

      // Perform server-side sentiment risk evaluation using Gemini if API_KEY is set
      if (process.env.API_KEY && newComment.text) {
        try {
          const riskResult = await analyzeCommentForRisks(newComment.text);
          newComment.risk = riskResult;
        } catch (e) {
          console.error("Failed to analyze comment sentiment risk:", e);
        }
      }

      serverComments.push(newComment);
      res.status(201).json(newComment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // 4. Tasks CRUD APIs
  app.get('/api/tasks', (req, res) => {
    res.json(serverTasks);
  });

  app.post('/api/tasks', (req, res) => {
    try {
      const task: Task = req.body;
      const index = serverTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        serverTasks[index] = task;
        res.json(task);
      } else {
        const newTask: Task = {
          ...task,
          id: task.id || Date.now(),
          status: task.status || 'Pending'
        };
        serverTasks.push(newTask);
        res.status(201).json(newTask);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // 5. Shared Documents CRUD APIs
  app.get('/api/documents', (req, res) => {
    res.json(serverDocuments);
  });

  app.post('/api/documents', (req, res) => {
    try {
      const doc: SharedDocument = req.body;
      const index = serverDocuments.findIndex(d => d.id === doc.id);
      if (index !== -1) {
        serverDocuments[index] = doc;
        res.json(doc);
      } else {
        const newDoc: SharedDocument = {
          ...doc,
          id: doc.id || Date.now(),
          uploadedAt: doc.uploadedAt || new Date().toISOString(),
          analysisState: doc.analysisState || 'pending'
        };
        serverDocuments.push(newDoc);
        res.status(201).json(newDoc);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- Gemini AI Proxy Routes ---

  // 6. Run Modular Agent Workflow
  app.post('/api/run-agent', async (req, res) => {
    try {
      const { agent, context, userInput } = req.body;
      if (!agent) {
        return res.status(400).json({ error: 'Missing agent parameter' });
      }
      const response = await runAgent(agent, context, userInput);
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/run-agent:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 7. Analyze Document (CIM scan, financial parsing)
  app.post('/api/analyze-document', async (req, res) => {
    try {
      const { base64Content, mimeType } = req.body;
      if (!base64Content || !mimeType) {
        return res.status(400).json({ error: 'Missing base64Content or mimeType' });
      }
      const response = await analyzeDocument({ base64Content, mimeType });
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/analyze-document:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 8. Analyze VDR Document
  app.post('/api/analyze-vdr-document', async (req, res) => {
    try {
      const { base64Content, mimeType } = req.body;
      if (!base64Content || !mimeType) {
        return res.status(400).json({ error: 'Missing base64Content or mimeType' });
      }
      const response = await analyzeVDRDocument({ base64Content, mimeType });
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/analyze-vdr-document:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 9. Query VDR document corpus
  app.post('/api/query-vdr', async (req, res) => {
    try {
      const { query, documents } = req.body;
      if (!query || !documents) {
        return res.status(400).json({ error: 'Missing query or documents parameter' });
      }
      const response = await queryVDR(query, documents);
      res.json({ text: response });
    } catch (error: any) {
      console.error('API Error /api/query-vdr:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 10. Suggest Tasks from VDR Document summary
  app.post('/api/suggest-tasks', async (req, res) => {
    try {
      const { documentName, documentSummary } = req.body;
      const response = await suggestTasksFromDocument(documentName || '', documentSummary || '');
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/suggest-tasks:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 11. Analyze comment risk sentiment
  app.post('/api/analyze-comment', async (req, res) => {
    try {
      const { commentText } = req.body;
      const response = await analyzeCommentForRisks(commentText || '');
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/analyze-comment:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 12. Fetch AI-driven contextual deal room recommendations
  app.post('/api/ai-recommendations', async (req, res) => {
    try {
      const { deal, tasks, comments, documents } = req.body;
      if (!deal) {
        return res.status(400).json({ error: 'Missing deal parameter' });
      }
      const response = await getAIRecommendations(deal, tasks || [], comments || [], documents || []);
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/ai-recommendations:', error);
      res.json([]); // return safe empty array on failure
    }
  });

  // 13. Suggest contextual tasks for a Deal
  app.post('/api/suggest-deal-tasks', async (req, res) => {
    try {
      const { deal, existingTasks } = req.body;
      if (!deal) {
        return res.status(400).json({ error: 'Missing deal parameter' });
      }
      const response = await suggestDealTasks(deal, existingTasks || []);
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/suggest-deal-tasks:', error);
      res.json([]); // return safe empty array on failure
    }
  });

  // 14. Query Lender matches
  app.post('/api/lender-matches', async (req, res) => {
    try {
      const { deal, lenders } = req.body;
      if (!deal || !lenders) {
        return res.status(400).json({ error: 'Missing deal or lenders parameter' });
      }
      const response = await getLenderMatches(deal, lenders);
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/lender-matches:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 15. Run Quality of Earnings (QoE) analysis
  app.post('/api/analyze-qoe', async (req, res) => {
    try {
      const { qoeData, deal } = req.body;
      if (!qoeData || !deal) {
        return res.status(400).json({ error: 'Missing qoeData or deal parameter' });
      }
      const response = await analyzeQoE(qoeData, deal);
      res.json({ text: response });
    } catch (error: any) {
      console.error('API Error /api/analyze-qoe:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 16. Get Typical Industry Valuation Multiples
  app.post('/api/industry-multiple', async (req, res) => {
    try {
      const { industry } = req.body;
      if (!industry) {
        return res.status(400).json({ error: 'Missing industry parameter' });
      }
      const response = await getIndustryMultiple(industry);
      res.json(response);
    } catch (error: any) {
      console.error('API Error /api/industry-multiple:', error);
      res.status(500).json({ error: error.message });
    }
  });


  // --- Vite / Static Serves ---

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve build static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer().catch(err => {
  console.error("Server failed to start:", err);
  process.exit(1);
});
