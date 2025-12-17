
import React, { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { VDRChatMessage } from '../types';
import { ChatBubbleIcon, PaperClipIcon, CheckIcon, DoubleCheckIcon, UploadIcon } from './icons';

interface VDRChatProps {
    history: VDRChatMessage[];
    onQuery: (query: string) => void;
    isLoading: boolean;
    onUploadDocument?: (file: File) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex space-x-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg w-16 items-center justify-center">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
);

const MessageBubble: React.FC<{ message: VDRChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    const timestamp = message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div 
                className={`
                    max-w-[80%] p-3 rounded-2xl relative shadow-sm
                    ${isUser 
                        ? 'bg-brand-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    }
                `}
            >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <div className={`flex items-center justify-end mt-1 space-x-1 ${isUser ? 'text-blue-200' : 'text-gray-400'}`}>
                    <span className="text-[10px]">{timestamp}</span>
                    {isUser && message.status === 'sent' && <CheckIcon className="w-3 h-3" />}
                    {isUser && message.status === 'delivered' && <DoubleCheckIcon className="w-3 h-3" />}
                    {isUser && message.status === 'read' && <DoubleCheckIcon className="w-3 h-3 text-blue-200" />}
                </div>
            </div>
        </div>
    );
};

const VDRChat: React.FC<VDRChatProps> = ({ history, onQuery, isLoading, onUploadDocument }) => {
    const [input, setInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history, isLoading]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onQuery(input.trim());
            setInput('');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && onUploadDocument) {
            onUploadDocument(e.target.files[0]);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0 && onUploadDocument) {
            onUploadDocument(acceptedFiles[0]);
        }
    }, [onUploadDocument]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        noClick: true, // Disable click on the container, use the button instead
        noKeyboard: true,
        accept: { 'application/pdf': ['.pdf'] }
    });

    return (
        <div 
            {...getRootProps()}
            className="bg-white dark:bg-gray-900 p-0 rounded-lg shadow-md flex flex-col h-[36rem] relative overflow-hidden border border-gray-200 dark:border-gray-700"
        >
            <input {...getInputProps()} />
            
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-brand-blue-100 dark:bg-brand-blue-900 flex items-center justify-center mr-3">
                        <ChatBubbleIcon className="w-5 h-5 text-brand-blue-600 dark:text-brand-blue-400"/>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white">VDR Assistant</h3>
                        <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Drag Overlay */}
            {isDragActive && (
                <div className="absolute inset-0 z-50 bg-brand-blue-50/90 dark:bg-gray-800/90 flex flex-col items-center justify-center border-4 border-brand-blue-500 border-dashed m-2 rounded-lg">
                    <UploadIcon className="w-12 h-12 text-brand-blue-600 mb-2 animate-bounce" />
                    <p className="text-lg font-semibold text-brand-blue-700 dark:text-brand-blue-300">Drop PDF to upload to VDR</p>
                </div>
            )}

            {/* Chat Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
                {history.length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>Ask questions about your uploaded documents.</p>
                        <p className="text-xs mt-2">Try "What are the key risks in the CIM?"</p>
                    </div>
                )}
                {history.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <TypingIndicator />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="application/pdf"
                        onChange={handleFileSelect}
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-brand-blue-600 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Upload Document"
                    >
                        <PaperClipIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1 p-2.5 text-sm text-gray-900 bg-gray-100 rounded-full border-transparent focus:bg-white focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:focus:bg-gray-700 transition-all outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="p-2.5 bg-brand-blue-600 text-white rounded-full hover:bg-brand-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VDRChat;
