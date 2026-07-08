# AcquiStack AI 🚀
### *The Ultimate AI-Powered M&A Copilot for SBA-Compliant Acquisitions*

AcquiStack AI is an elite full-featured underwriting, deal discovery, and educational sandbox platform designed for searchers, M&A professionals, and entrepreneurs looking to acquire small-to-medium businesses (SMBs) utilizing SBA 7(a) financing programs.

---

## 🎨 System Overview & Core Modules

The platform is designed around a single-view context-aware layout that transitions gracefully between overall pipeline navigation and granular transactional analysis:

### 1. 💼 Multi-Deal Pipeline Dashboard
- Manage and track multiple concurrent acquisition campaigns.
- Visual status tags (e.g., *Initial Analysis*, *LOI Stage*, *Underwriting*, *Closed*).
- Complete financial state overview indicating total purchase prices, debt burdens, and borrower liquidity requirements.

### 2. 🎛️ Capital Stack Sandbox
- Build and fine-tune complex capital stacks involving Senior Debt, Seller Notes (on full or partial standby), Rollover Equity, and Investor Cash.
- Interactive sliders to dynamically simulate changes in interest rates, loan terms (amortization years), and seller financing percentages.
- Automatic verification of **SBA SOP 50 10** compliance rules (e.g., minimum 10% equity injection).

### 3. 🔍 CIM Quick AI Scan
- Simulate the upload of private business teasers or Confidential Information Memorandums (CIMs).
- Run simulated OCR/AI extractions to automatically parse income statements, locate normalized EBITDA, check multiples, map risks (owner dependency, client concentration), and extract deep-dive Q&As.
- Instant single-click import to pipeline workspace.

### 4. 🛒 SBA Deal Marketplace
- Access a curated stream of active, highly premium SMB investment listings across Services, Tech, and Manufacturing.
- Filter, inspect metrics, and instantly import target opportunities directly into your live underwriting workbench with pre-built financial models and due-diligence checklists.

### 5. 🎓 SBA Acquisition Academy
- **SOP Playbook**: Stay updated with the latest SBA SOP regulations on equity injections, seller financing standby notes, and risk management guidelines.
- **Interactive Calculators**: Quickly run Debt Service Coverage Ratio (DSCR) calculations and calculate remaining cash down payments.
- **Acquisition Checklist**: Track your interactive milestones from the pre-LOI NDA signing all the way to legal closing audits.
- **M&A Glossary**: Click-to-expand deep definitions for complex concepts like SDE, EBITDA, Full Standby, and Working Capital Pegs.

---

## 🛠️ Technology Stack & Dependencies

AcquiStack AI is built using highly modern, performant frontend technologies:

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for fluid responsive styling, clean typography layouts, and premium light/dark styling.
- **Icons**: [Lucide React](https://lucide.dev/) for crisp, scalable vector UI indicators.
- **AI Integration**: Prepared with `@google/genai` TypeScript SDK for advanced server-side model calls.

---

## ⚙️ Running Locally

Follow these quick steps to launch the AcquiStack AI development environment:

### 1. Install Dependencies
Ensure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
npm install
```

### 2. Run Dev Server
Launch Vite's fast HMR dev server on port `3000`:
```bash
npm run dev
```

### 3. Build for Production
Create an optimized static distribution inside `/dist`:
```bash
npm run build
```

---

## 📐 Design & Usability Philosophy

- **Aesthetic Pairings**: Structured around a premium light theme with deep slate colors, generous negative margins, and crisp geometric accents.
- **Touch & Responsive Friendly**: Full desktop-first precision combined with robust mobile-first layouts so you can analyze deals on the go.
- **No Mock Indicators**: Built around real structural data, real equations, and deterministic SBA regulations.
