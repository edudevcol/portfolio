import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { PROFILE, Icons } from '../constants';
import Avatar, { type AvatarStatus } from './Avatar';
import { DEFAULT_AVATAR_ID, AVATARS } from './avatars.config';
import { useAudioAnalyzer } from '../hooks/useAudioAnalyzer';
import { useVoiceStream } from '../hooks/useVoiceStream';
import { useLanguage } from '../contexts/LanguageContext';

const AvatarSection: React.FC = () => {
  const { t } = useLanguage();
  const avatarTranslations = t('avatar');
  
  const [status, setStatus] = useState<AvatarStatus>('idle');
  const [volume, setVolume] = useState(0);
  const [mouthShape, setMouthShape] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(DEFAULT_AVATAR_ID);
  const [callDuration, setCallDuration] = useState(0);

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

  // Cuando Gemini está listo (session_ready) y hay llamada pendiente, iniciarla
  useEffect(() => {
    if (isSessionReady && pendingCallRef.current) {
      pendingCallRef.current = false;
      startCall('Hola');
    }
  }, [isSessionReady, startCall]);

  // Temporizador de llamada
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

  return (
    <section id="avatar" className="py-20 relative overflow-hidden bg-slate-950 text-slate-100 border-y border-slate-800/80">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-semibold mb-4 shadow-inner">
            <span className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-green-400 animate-pulse' : 'bg-primary-400 animate-ping'}`}></span>
            <Icons.Sparkles /> {avatarTranslations.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {avatarTranslations.title}
          </h2>
          <p className="text-slate-400 text-lg">
            {avatarTranslations.description}
          </p>
        </div>

        {/* Main Grid: Avatar Display & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Avatar Player */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative group">
              
              {/* Status Bar */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {isCallActive ? callStatusLabel : isConnected ? avatarTranslations.connected : avatarTranslations.disconnected}
                  </span>
                </div>
                {isCallActive && (
                  <span className="text-xs font-mono text-primary-400">{formatTime(callDuration)}</span>
                )}
              </div>

              {/* Avatar Graphic Frame */}
              <div className="relative flex items-center justify-center py-6 min-h-[320px] rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 overflow-hidden shadow-inner">
                
                {/* Visualizer Particles Background */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

                {/* Avatar */}
                <div className="relative flex flex-col items-center">
                  {/* Glowing Aura Ring */}
                  <div className={`absolute w-64 h-64 rounded-full transition-all duration-500 blur-2xl ${
                    isSpeaking ? 'bg-primary-500/30 scale-110 animate-pulse' : 'bg-cyan-500/10'
                  }`}></div>

                  {/* Avatar Container */}
                  <div className="relative w-[280px] h-[310px] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-slate-950/60 border border-slate-800">
                    <Avatar 
                      avatarId={selectedAvatar} 
                      volume={volume} 
                      mouthShape={mouthShape} 
                      status={avatarStatus}
                      width={280}
                      height={310}
                    />
                  </div>

                  {/* Audio Equalizer Bars below avatar */}
                  <div className="flex items-center gap-1.5 mt-4 h-6">
                    {[12, 24, 18, 30, 20, 28, 14, 22, 16, 26].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-200 ${
                          isSpeaking
                            ? 'bg-gradient-to-t from-primary-500 to-cyan-400 animate-pulse'
                            : 'bg-slate-700 h-2'
                        }`}
                        style={{
                          height: isSpeaking ? `${Math.floor(Math.random() * 20) + 6}px` : '4px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="mt-6 flex items-center justify-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                {!isCallActive ? (
                  <button
                    onClick={handleStartCall}
                    className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-all duration-200"
                    aria-label={avatarTranslations.startCall}
                  >
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                    </svg>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={toggleMute}
                      className={`p-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                        isMuted
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                      }`}
                      title={isMuted ? avatarTranslations.unmute : avatarTranslations.mute}
                    >
                      {isMuted ? <Icons.VolumeMute /> : <Icons.Volume />}
                    </button>
                    <button
                      onClick={handleEndCall}
                      className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/40 transition-all duration-200"
                      aria-label={avatarTranslations.endCall}
                    >
                      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                        <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.49 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="w-full mt-4 bg-red-900/40 border border-red-700/50 rounded-lg px-4 py-3">
                <p className="text-red-300 text-sm text-center">{errorMsg}</p>
              </div>
            )}
          </div>

          {/* Right Column: Info & Instructions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Instructions */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Terminal /> {avatarTranslations.howItWorks}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{avatarTranslations.step1Title}</h4>
                    <p className="text-slate-400 text-sm">{avatarTranslations.step1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{avatarTranslations.step2Title}</h4>
                    <p className="text-slate-400 text-sm">{avatarTranslations.step2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{avatarTranslations.step3Title}</h4>
                    <p className="text-slate-400 text-sm">{avatarTranslations.step3Desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Sparkles /> {avatarTranslations.suggestedQuestions}
              </h4>
              
              <div className="grid grid-cols-1 gap-2">
                <button
                  disabled={!isCallActive}
                  className="text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm text-slate-300 hover:text-white"
                >
                  {avatarTranslations.q1}
                </button>
                <button
                  disabled={!isCallActive}
                  className="text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm text-slate-300 hover:text-white"
                >
                  {avatarTranslations.q2}
                </button>
                <button
                  disabled={!isCallActive}
                  className="text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm text-slate-300 hover:text-white"
                >
                  {avatarTranslations.q3}
                </button>
                <button
                  disabled={!isCallActive}
                  className="text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-primary-500/50 hover:bg-slate-800/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm text-slate-300 hover:text-white"
                >
                  {avatarTranslations.q4}
                </button>
              </div>
              
              {!isCallActive && (
                <p className="text-xs text-slate-500 mt-3 text-center">{avatarTranslations.startCallToAsk}</p>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AvatarSection;
