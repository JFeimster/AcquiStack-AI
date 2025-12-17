import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Deal, TranscriptionTurn } from '../types';
import { decode, decodeAudioData, createBlob } from '../utils/audio';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal;
}

type ConnectionState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose, deal }) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [transcriptionHistory, setTranscriptionHistory] = useState<TranscriptionTurn[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const ai = useRef<GoogleGenAI | null>(null);
  const sessionPromise = useRef<Promise<any> | null>(null);
  const inputAudioContext = useRef<AudioContext | null>(null);
  const outputAudioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
  
  const sources = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTime = useRef(0);

  const cleanup = useCallback(() => {
    console.log("Cleaning up resources...");
    
    // Stop microphone stream
    if (mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
        mediaStream.current = null;
    }

    // Disconnect audio nodes
    if (scriptProcessor.current) {
        scriptProcessor.current.disconnect();
        scriptProcessor.current = null;
    }
    if (mediaStreamSource.current) {
        mediaStreamSource.current.disconnect();
        mediaStreamSource.current = null;
    }

    // Close audio contexts
    if (inputAudioContext.current && inputAudioContext.current.state !== 'closed') {
        inputAudioContext.current.close();
    }
    if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
        outputAudioContext.current.close();
    }
    
    // Close session
    if (sessionPromise.current) {
      sessionPromise.current.then(session => {
        if (session) session.close();
      }).catch(console.error);
      sessionPromise.current = null;
    }

    // Reset state
    setConnectionState('idle');
    setCurrentInput('');
    setCurrentOutput('');

  }, []);

  const handleClose = () => {
    cleanup();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      cleanup();
    }
    
    return () => {
      cleanup();
    };
  }, [isOpen]);

  const startSession = async () => {
    if (!process.env.API_KEY) {
      setError("API_KEY environment variable is not set.");
      setConnectionState('error');
      return;
    }
    
    setError(null);
    setConnectionState('connecting');
    setTranscriptionHistory([]);

    try {
      ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
      inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      const systemInstruction = `You are a helpful voice assistant for AcquiStack AI. The user has provided the following deal information. Use it to answer their questions. Deal Info: ${JSON.stringify(deal)}`;
      
      sessionPromise.current = ai.current.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setConnectionState('listening');
            if (!inputAudioContext.current || !mediaStream.current) return;
            
            mediaStreamSource.current = inputAudioContext.current.createMediaStreamSource(mediaStream.current);
            scriptProcessor.current = inputAudioContext.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              if (sessionPromise.current) {
                 sessionPromise.current.then((session) => {
                   session.sendRealtimeInput({ media: pcmBlob });
                 });
              }
            };
            
            mediaStreamSource.current.connect(scriptProcessor.current);
            scriptProcessor.current.connect(inputAudioContext.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             handleServerMessage(message);
          },
          onerror: (e: ErrorEvent) => {
            console.error('Session error:', e);
            setError('An error occurred with the connection.');
            setConnectionState('error');
            cleanup();
          },
          onclose: (e: CloseEvent) => {
            console.log('Session closed.');
            cleanup();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
      });

    } catch (err) {
      console.error("Failed to start session:", err);
      setError(err instanceof Error ? err.message : 'Failed to initialize microphone or AI session.');
      setConnectionState('error');
      cleanup();
    }
  };
  
  const handleServerMessage = async (message: LiveServerMessage) => {
      // Handle transcription
      if (message.serverContent?.inputTranscription) {
        setCurrentInput(prev => prev + message.serverContent.inputTranscription.text);
      }
      if (message.serverContent?.outputTranscription) {
        setConnectionState('speaking');
        setCurrentOutput(prev => prev + message.serverContent.outputTranscription.text);
      }
      if (message.serverContent?.turnComplete) {
        const fullInput = currentInput + (message.serverContent.inputTranscription?.text || '');
        const fullOutput = currentOutput + (message.serverContent.outputTranscription?.text || '');
       
        setTranscriptionHistory(prev => [...prev, {speaker: 'user', text: fullInput}, {speaker: 'model', text: fullOutput}]);
        
        setCurrentInput('');
        setCurrentOutput('');
        setConnectionState('listening');
      }

      // Handle audio playback
      const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
      if (audioData && outputAudioContext.current) {
        setConnectionState('speaking');
        const ctx = outputAudioContext.current;
        nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
        
        const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.addEventListener('ended', () => {
            sources.current.delete(source);
            if (sources.current.size === 0) {
               setConnectionState('listening');
            }
        });

        source.start(nextStartTime.current);
        nextStartTime.current += audioBuffer.duration;
        sources.current.add(source);
      }
      
      const interrupted = message.serverContent?.interrupted;
      if (interrupted) {
        for (const source of sources.current.values()) {
          source.stop();
          sources.current.delete(source);
        }
        nextStartTime.current = 0;
        setConnectionState('listening');
      }
  }


  if (!isOpen) return null;

  const getStatusIndicator = () => {
    switch(connectionState) {
        case 'connecting': return <><span className="animate-pulse">Connecting...</span></>;
        case 'listening': return <><span className="text-green-400">Listening...</span></>;
        case 'speaking': return <><span className="text-blue-400 animate-pulse">AI is speaking...</span></>;
        case 'error': return <><span className="text-red-400">Error</span></>;
        default: return <>Idle</>;
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex flex-col items-center justify-center p-4 text-white font-sans">
      <button onClick={handleClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="w-full max-w-4xl h-full flex flex-col">
        <header className="text-center py-6 flex-shrink-0">
          <h1 className="text-3xl font-bold">AcquiStack AI Voice Assistant</h1>
          <p className="text-lg text-gray-300 mt-2">Status: {getStatusIndicator()}</p>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-800/50 rounded-lg p-6 space-y-4">
          {transcriptionHistory.map((turn, index) => (
            <div key={index} className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-prose p-3 rounded-lg ${turn.speaker === 'user' ? 'bg-brand-blue-600' : 'bg-gray-700'}`}>
                <p className="text-sm font-bold capitalize mb-1">{turn.speaker}</p>
                <p>{turn.text}</p>
              </div>
            </div>
          ))}
          {currentInput && (
             <div className="flex justify-end opacity-70">
                <div className="max-w-prose p-3 rounded-lg bg-brand-blue-800">
                   <p>{currentInput}</p>
                </div>
            </div>
          )}
           {currentOutput && (
             <div className="flex justify-start opacity-70">
                <div className="max-w-prose p-3 rounded-lg bg-gray-600">
                   <p>{currentOutput}</p>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VoiceAssistant;