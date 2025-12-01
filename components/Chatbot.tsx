import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { logChatInteraction } from '../services/chatLogger';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: '¡Hola! Soy la IA asistente de este portfolio. ¿Tienes alguna pregunta sobre mi experiencia en Testing o Desarrollo?',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    // Log user message
    logChatInteraction(userMsg);

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    // Prepare history for API (exclude init message if strictly needed, but init is fine)
    const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));

    const aiResponseText = await sendMessageToGemini(userMsg.text, historyForApi);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    // Log AI message
    logChatInteraction(aiMsg);

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const initialMsg: ChatMessage = {
        id: 'init',
        role: 'model',
        text: '¡Hola! Soy la IA asistente de este portfolio. ¿Tienes alguna pregunta sobre mi experiencia en Testing o Desarrollo?',
        timestamp: new Date(),
    };

    // If there are actual messages exchanged (length > 1), confirm first
    if (messages.length > 1) {
        if (window.confirm("¿Estás seguro de borrar la conversación?")) {
            setMessages([initialMsg]);
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    } else {
        // If it's already empty, just reset (force reset to ensure state is clean)
        setMessages([initialMsg]);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleDownloadChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (messages.length <= 1) {
        alert("No hay conversación para descargar aún.");
        return;
    }

    const chatText = messages.map(m => {
        const time = m.timestamp.toLocaleTimeString();
        const role = m.role === 'user' ? 'USUARIO' : 'ASISTENTE';
        return `[${time}] ${role}:\n${m.text}\n-------------------`;
    }).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-transcript-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-96 h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right ring-1 ring-white/10">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600/20 rounded-lg text-primary-400">
                <Icons.Bot />
              </div>
              <div>
                 <span className="block font-bold text-white text-sm">Asistente Virtual</span>
                 <span className="flex items-center gap-1.5 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                 </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
                <button 
                    type="button"
                    onClick={handleDownloadChat} 
                    title="Guardar conversación"
                    className="text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 transition-colors p-1.5 rounded-md"
                >
                    <Icons.Download />
                </button>
                <button 
                    type="button"
                    onClick={handleClear} 
                    title="Limpiar chat"
                    className="text-slate-400 hover:text-red-400 hover:bg-slate-700/50 transition-colors p-1.5 rounded-md"
                >
                    <Icons.Trash />
                </button>
                <button 
                    type="button"
                    onClick={() => setIsOpen(false)} 
                    title="Cerrar"
                    className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700/50"
                >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary-600 text-white rounded-br-none' 
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2 items-center shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-slate-900 text-white text-sm rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-500"
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputText.trim()}
              className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-105 active:scale-95"
            >
              <Icons.Send />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group relative z-50
          ${isOpen ? 'bg-slate-700 text-slate-300 rotate-90' : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white animate-bounce-slight'}
        `}
      >
         {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-slate-900 shadow-sm"></span>
        )}
        {isOpen ? <Icons.Close /> : <Icons.Bot />}
      </button>
    </div>
  );
};

export default Chatbot;