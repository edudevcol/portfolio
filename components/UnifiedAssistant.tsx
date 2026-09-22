import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Icons } from '../constants';
import { ChatMessage } from '../types';
import Avatar, { type AvatarStatus } from './Avatar';
import { DEFAULT_AVATAR_ID, AVATARS } from './avatars.config';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import { useVoiceStream } from '../hooks/useVoiceStream';
import { useLanguage } from '../contexts/LanguageContext';
import { sendMessageToGemini } from '../services/geminiService';
import { logChatInteraction } from '../services/chatLogger';
import { track } from '@vercel/analytics/react';

const UnifiedAssistant: React.FC = () => {
  const { t } = useLanguage();
  const avatarTranslations = t('avatar');
  
  // Avatar voice state
  const [status, setStatus] = useState<AvatarStatus>('idle');
  const [volume, setVolume] = useState(0);
  const [mouthShape, setMouthShape] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR_ID);
  const [callDuration, setCallDuration] = useState(0);

  // Chat state (hidden - no toggle button)
  const [isChatOpen, setIsChatOpen] = useState(false);
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

  const isSpeakingRef = useRef(false);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingCallRef = useRef(false);

  const {
    initAudioContext,
    setOnVolume,
    scheduleAudioChunk,
    startVolumeLoop,
    stopVolumeLoop,
    resetPlayTime,
    getRemainingPlayTime,
    stopPlayback,
    resumeAudioContext
  } = useAudioAnalyzer();

  useEffect(() => {
    setOnVolume(({ jaw, shape }) => {
      setVolume(jaw);
      setMouthShape(shape);
    });
  }, [setOnVolume]);

  const handleAudioChunk = useCallback((pcmBase64: string) => {
    scheduleAudioChunk(pcmBase64);
    if (!isSpeakingRef.current) {
      isSpeakingRef.current = true;
      setIsSpeaking(true);
      setStatus('speaking');
      startVolumeLoop();
    }
  }, [scheduleAudioChunk, startVolumeLoop]);

  const handleTurnComplete = useCallback(() => {
    const remaining = getRemainingPlayTime();
    setTimeout(() => {
      isSpeakingRef.current = false;
      stopVolumeLoop();
      setIsSpeaking(false);
      setStatus('idle');
      resetPlayTime();
    }, remaining + 100);
  }, [stopVolumeLoop, resetPlayTime, getRemainingPlayTime]);

  const handleStatusChange = useCallback((newStatus: string) => {
    if (newStatus === 'thinking') setStatus('thinking');
    else if (newStatus === 'listening') setStatus('listening');
    else if (newStatus === 'idle') setStatus(prev => prev === 'speaking' ? prev : 'idle');
  }, []);

  const handleInterrupted = useCallback(() => {
    stopPlayback();
    stopVolumeLoop();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setStatus('listening');
  }, [stopPlayback, stopVolumeLoop]);

  const handleError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setStatus('error');
    setTimeout(() => setErrorMsg(''), 5000);
  }, []);

  const selectedVoice = useMemo(() => {
    const avatar = AVATARS.find(a => a.id === selectedAvatar);
    return avatar?.voice;
  }, [selectedAvatar]);

  const {
    isConnected,
    isSessionReady,
    isCallActive,
    isMuted,
    connect,
    startCall,
    endCall,
    toggleMute
  } = useVoiceStream({
    onAudioChunk: handleAudioChunk,
    onTurnComplete: handleTurnComplete,
    onStatusChange: handleStatusChange,
    onError: handleError,
    onInterrupted: handleInterrupted,
    voice: selectedVoice,
    avatarId: selectedAvatar,
    profile: 'cv'
  });

  useEffect(() => {
    if (isSessionReady && pendingCallRef.current) {
      pendingCallRef.current = false;
      startCall('Hola');
    }
  }, [isSessionReady, startCall]);

  useEffect(() => {
    if (isCallActive) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    } else {
      if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
      setCallDuration(0);
    }
    return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
  }, [isCallActive]);

  const handleStartCall = useCallback(async () => {
    // Es la métrica que de verdad importa en un portfolio: no cuántos
    // entraron a la página, sino cuántos llegaron a hablar con el avatar.
    track('avatar_call_started');
    initAudioContext();
    await resumeAudioContext();
    pendingCallRef.current = true;
    connect();
  }, [connect, initAudioContext, resumeAudioContext]);

  const handleEndCall = useCallback(() => {
    stopPlayback();
    stopVolumeLoop();
    isSpeakingRef.current = false;
    setIsSpeaking(false);
    setStatus('idle');
    setErrorMsg('');
    endCall();
  }, [stopPlayback, stopVolumeLoop, endCall]);

  const avatarStatus: AvatarStatus = isSpeaking ? 'speaking' : status;

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const callStatusLabel = isSpeaking
    ? avatarTranslations.speaking
    : status === 'thinking'
      ? avatarTranslations.thinking
      : isMuted
        ? avatarTranslations.muted
        : status === 'listening'
          ? avatarTranslations.listening
          : avatarTranslations.inCall;

  // Chat functionality (hidden - no UI to open it)
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    logChatInteraction(userMsg);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const aiResponse = await sendMessageToGemini(currentInput, history);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      logChatInteraction(aiMsg);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Error al conectar con Gemini.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const initialMsg: ChatMessage = {
        id: 'init',
        role: 'model',
        text: '¡Hola! Soy la IA asistente de este portfolio. ¿Tienes alguna pregunta sobre mi experiencia en Testing o Desarrollo?',
        timestamp: new Date(),
    };

    if (messages.length > 1) {
        if (window.confirm("¿Estás seguro de borrar la conversación?")) {
            setMessages([initialMsg]);
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    } else {
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center font-sans">
      {/* Chat Window (hidden - no toggle button to open it) */}
      {isChatOpen && (
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
                    onClick={() => setIsChatOpen(false)} 
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

      {/* Avatar */}
      <div className="relative w-[200px] h-[220px] flex items-center justify-center bg-transparent">
        <Avatar 
          avatarId={selectedAvatar} 
          volume={volume} 
          mouthShape={mouthShape} 
          status={avatarStatus}
          width={200}
          height={220}
        />
      </div>

      {/* Call Button */}
      <div className="mt-2">
        {!isCallActive ? (
          <button
            onClick={handleStartCall}
            className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-400 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.49 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
            </svg>
          </button>
        )}
      </div>

      {/* Error */}
      {errorMsg && (
        <div className="mt-2 bg-red-900/40 border border-red-700/50 rounded-lg px-3 py-2">
          <p className="text-red-300 text-xs text-center">{errorMsg}</p>
        </div>
      )}
    </div>
  );
};

export default UnifiedAssistant;
