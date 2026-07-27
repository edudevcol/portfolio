import { useRef, useState, useCallback, useEffect, MutableRefObject } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || '';
const TARGET_SAMPLE_RATE = 16000;
const BUFFER_SIZE = 4096;

export interface ToolNotification {
  name: string;
  success?: boolean;
  error?: string;
}

interface UseVoiceStreamOptions {
  onAudioChunk: (data: string) => void;
  onTurnComplete: () => void;
  onStatusChange: (status: string) => void;
  onError: (msg: string) => void;
  onInterrupted?: () => void;
  onToolStart?: (name: string) => void;
  onToolResult?: (n: ToolNotification) => void;
  onReminderNotification?: (message: string) => void;
  voice?: string;
  model?: string;
  enabledTools?: string[];
  avatarId?: string;
  profile?: string;
}

interface ServerMessage {
  type: string;
  data?: string;
  status?: string;
  message?: string;
  name?: string;
  success?: boolean; error?: string;
  reminder_message?: string;
}

/**
 * useVoiceStream — Canal de voz con VAD nativo de Gemini.
 * El micrófono transmite continuamente; Gemini gestiona los turnos.
 */
export function useVoiceStream({
  onAudioChunk, onTurnComplete, onStatusChange, onError,
  onInterrupted, onToolStart, onToolResult, onReminderNotification, voice, model, enabledTools, avatarId, profile
}: UseVoiceStreamOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const facingModeRef = useRef<'user' | 'environment'>('user');

  const wsRef = useRef<WebSocket | null>(null);
  const isConnectingRef = useRef(false);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const isCallActiveRef = useRef(false);
  const isMutedRef = useRef(false);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const screenIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isScreenShareActiveRef = useRef(false);

  const onAudioChunkRef = useRef(onAudioChunk);
  const onTurnCompleteRef = useRef(onTurnComplete);
  const onStatusChangeRef = useRef(onStatusChange);
  const onErrorRef = useRef(onError);
  const onInterruptedRef = useRef(onInterrupted);
  const onToolStartRef = useRef(onToolStart);
  const onToolResultRef = useRef(onToolResult);
  const onReminderNotificationRef = useRef(onReminderNotification);
  const voiceRef = useRef(voice);
  const modelRef = useRef(model);
  const enabledToolsRef = useRef(enabledTools);
  const avatarIdRef = useRef(avatarId);

  useEffect(() => {
    onAudioChunkRef.current = onAudioChunk;
    onTurnCompleteRef.current = onTurnComplete;
    onStatusChangeRef.current = onStatusChange;
    onErrorRef.current = onError;
    onInterruptedRef.current = onInterrupted;
    onToolStartRef.current = onToolStart;
    onToolResultRef.current = onToolResult;
    onReminderNotificationRef.current = onReminderNotification;
    voiceRef.current = voice;
    modelRef.current = model;
    enabledToolsRef.current = enabledTools;
    avatarIdRef.current = avatarId;
  }, [onAudioChunk, onTurnComplete, onStatusChange, onError, onInterrupted, onToolStart, onToolResult, onReminderNotification, voice, model, enabledTools, avatarId]);

  const enabledToolsKey = JSON.stringify(enabledTools);
  useEffect(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'config', voice, model, enabledTools, avatarId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice, model, enabledToolsKey, avatarId]);

  const float32ToInt16 = useCallback((buf: Float32Array): Int16Array => {
    const out = new Int16Array(buf.length);
    for (let i = 0; i < buf.length; i++) {
      const c = Math.max(-1, Math.min(1, buf[i]));
      out[i] = c < 0 ? c * 32768 : c * 32767;
    }
    return out;
  }, []);

  const resample = useCallback((buf: Float32Array, src: number, dst: number): Float32Array => {
    if (src === dst) return buf;
    const ratio = src / dst;
    const out = new Float32Array(Math.round(buf.length / ratio));
    for (let i = 0; i < out.length; i++) {
      const pos = i * ratio;
      const idx = Math.floor(pos);
      const frac = pos - idx;
      out[i] = (buf[idx] || 0) + frac * ((buf[idx + 1] || 0) - (buf[idx] || 0));
    }
    return out;
  }, []);

  const toBase64 = useCallback((buf: ArrayBuffer): string => {
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }, []);

  const connect = useCallback(() => {
    if (!WS_URL) {
      onErrorRef.current?.('Establece la variable de entorno con la URL del servidor WebSocket: VITE_WS_URL');
      return;
    }
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnectingRef.current) return;
    isConnectingRef.current = true;
    const wsUrl = profile ? `${WS_URL}?profile=${encodeURIComponent(profile)}` : WS_URL;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      isConnectingRef.current = false;
      ws.send(JSON.stringify({ type: 'config', voice: voiceRef.current, model: modelRef.current, enabledTools: enabledToolsRef.current, avatarId: avatarIdRef.current }));
    };

    ws.onmessage = (event: MessageEvent) => {
      let msg: ServerMessage;
      try { msg = JSON.parse(event.data as string); } catch { return; }
      switch (msg.type) {
        case 'session_ready': onStatusChangeRef.current?.('idle'); setIsSessionReady(true); break;
        case 'audio_chunk':
          if (msg.data) onAudioChunkRef.current?.(msg.data);
          break;
        case 'turn_complete':
          onTurnCompleteRef.current?.();
          break;
        case 'interrupted': onInterruptedRef.current?.(); break;
        case 'status': if (msg.status) onStatusChangeRef.current?.(msg.status); break;
        case 'tool_start': if (msg.name) onToolStartRef.current?.(msg.name); break;
        case 'tool_result':
          if (msg.name) onToolResultRef.current?.({ name: msg.name, success: msg.success, error: msg.error });
          break;
        case 'error': if (msg.message) onErrorRef.current?.(msg.message); break;
        case 'reminder_notification': if (msg.message) onReminderNotificationRef.current?.(msg.message); break;
      }
    };

    ws.onclose = () => { setIsConnected(false); setIsSessionReady(false); isConnectingRef.current = false; wsRef.current = null; };
    ws.onerror = () => {
      onErrorRef.current?.('No se pudo conectar con el servidor.');
      isConnectingRef.current = false;
    };
  }, []);

  const stopStreaming = useCallback(() => {
    isCallActiveRef.current = false;
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (sourceRef.current) { sourceRef.current.disconnect(); sourceRef.current = null; }
    if (micStreamRef.current) { micStreamRef.current.getTracks().forEach(t => t.stop()); micStreamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
  }, []);

  const startCall = useCallback(async (initialMessage?: string) => {
    if (isCallActiveRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      micStreamRef.current = stream;
      audioCtxRef.current = new AudioContext();
      const nativeSR = audioCtxRef.current.sampleRate;

      sourceRef.current = audioCtxRef.current.createMediaStreamSource(stream);
      processorRef.current = audioCtxRef.current.createScriptProcessor(BUFFER_SIZE, 1, 1);

      processorRef.current.onaudioprocess = (ev: AudioProcessingEvent) => {
        if (!isCallActiveRef.current || isMutedRef.current) return;
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        const data = ev.inputBuffer.getChannelData(0);

        const resampled = resample(data, nativeSR, TARGET_SAMPLE_RATE);
        const int16 = float32ToInt16(resampled);
        const b64 = toBase64(int16.buffer as ArrayBuffer);
        wsRef.current!.send(JSON.stringify({ type: 'audio_chunk', data: b64 }));
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioCtxRef.current.destination);

      wsRef.current?.send(JSON.stringify({ type: 'start_call' }));
      
      // Enviar mensaje inicial si se proporciona
      if (initialMessage && wsRef.current?.readyState === WebSocket.OPEN) {
        console.log('Enviando mensaje inicial:', initialMessage);
        setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'text', data: initialMessage }));
            console.log('Mensaje inicial enviado');
          }
        }, 2000);
      }
      
      isCallActiveRef.current = true;
      setIsCallActive(true);
    } catch (err) {
      onErrorRef.current?.(`Error al acceder al micrófono: ${(err as Error).message}`);
    }
  }, [resample, float32ToInt16, toBase64]);

  const stopScreenShare = useCallback(() => {
    isScreenShareActiveRef.current = false;
    if (screenIntervalRef.current) { clearInterval(screenIntervalRef.current); screenIntervalRef.current = null; }
    if (screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); screenStreamRef.current = null; }
    if (screenVideoRef.current) { screenVideoRef.current.srcObject = null; screenVideoRef.current = null; }
    screenCanvasRef.current = null;
    setIsScreenShareActive(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    if (isScreenShareActiveRef.current || screenStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 5 } as MediaTrackConstraints
      });
      screenStreamRef.current = stream;

      stream.getVideoTracks()[0].onended = () => { stopScreenShare(); };

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      screenVideoRef.current = video;

      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      screenCanvasRef.current = canvas;

      await new Promise<void>(res => { video.onloadedmetadata = () => res(); });
      await video.play();

      screenIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        const ctx = canvas.getContext('2d');
        if (!ctx || !screenVideoRef.current) return;
        ctx.drawImage(screenVideoRef.current, 0, 0, 1280, 720);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const b64 = dataUrl.split(',')[1];
        if (b64) wsRef.current.send(JSON.stringify({ type: 'video_frame', data: b64 }));
      }, 1000);

      isScreenShareActiveRef.current = true;
      setIsScreenShareActive(true);
    } catch (err) {
      onErrorRef.current?.(`Error al compartir pantalla: ${(err as Error).message}`);
    }
  }, [stopScreenShare]);

  const endCall = useCallback(() => {
    stopStreaming();
    stopScreenShare();
    if (cameraIntervalRef.current) { clearInterval(cameraIntervalRef.current); cameraIntervalRef.current = null; }
    if (cameraStreamRef.current) { cameraStreamRef.current.getTracks().forEach(t => t.stop()); cameraStreamRef.current = null; }
    if (cameraVideoRef.current) { cameraVideoRef.current.srcObject = null; cameraVideoRef.current = null; }
    cameraCanvasRef.current = null;
    setIsCameraActive(false);
    setIsCallActive(false);
    setIsSessionReady(false);
    isMutedRef.current = false;
    setIsMuted(false);
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, [stopStreaming, stopScreenShare]);

  const toggleMute = useCallback(() => {
    const nowMuted = !isMutedRef.current;
    isMutedRef.current = nowMuted;
    setIsMuted(nowMuted);
  }, []);

  const startCamera = useCallback(async () => {
    if (isCameraActive || cameraStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: facingModeRef.current }
      });
      cameraStreamRef.current = stream;

      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      cameraVideoRef.current = video;

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      cameraCanvasRef.current = canvas;

      await new Promise<void>(res => { video.onloadedmetadata = () => res(); });
      await video.play();

      cameraIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, 640, 480);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const b64 = dataUrl.split(',')[1];
        if (b64) wsRef.current.send(JSON.stringify({ type: 'video_frame', data: b64 }));
      }, 1000);

      setIsCameraActive(true);
    } catch (err) {
      onErrorRef.current?.(`Error al acceder a la cámara: ${(err as Error).message}`);
    }
  }, [isCameraActive]);

  const stopCamera = useCallback(() => {
    if (cameraIntervalRef.current) { clearInterval(cameraIntervalRef.current); cameraIntervalRef.current = null; }
    if (cameraStreamRef.current) { cameraStreamRef.current.getTracks().forEach(t => t.stop()); cameraStreamRef.current = null; }
    if (cameraVideoRef.current) { cameraVideoRef.current.srcObject = null; cameraVideoRef.current = null; }
    cameraCanvasRef.current = null;
    setIsCameraActive(false);
  }, []);

  const flipCamera = useCallback(async () => {
    if (!isCameraActive) return;
    const newMode = facingModeRef.current === 'user' ? 'environment' : 'user';
    facingModeRef.current = newMode;
    setFacingMode(newMode);
    // Stop current stream
    if (cameraIntervalRef.current) { clearInterval(cameraIntervalRef.current); cameraIntervalRef.current = null; }
    if (cameraStreamRef.current) { cameraStreamRef.current.getTracks().forEach(t => t.stop()); cameraStreamRef.current = null; }
    if (cameraVideoRef.current) { cameraVideoRef.current.srcObject = null; cameraVideoRef.current = null; }
    cameraCanvasRef.current = null;
    setIsCameraActive(false);
    // Restart with new facingMode
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: newMode }
      });
      cameraStreamRef.current = stream;
      const video = document.createElement('video');
      video.srcObject = stream; video.autoplay = true; video.playsInline = true; video.muted = true;
      cameraVideoRef.current = video;
      const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 480;
      cameraCanvasRef.current = canvas;
      await new Promise<void>(res => { video.onloadedmetadata = () => res(); });
      await video.play();
      cameraIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        ctx.drawImage(video, 0, 0, 640, 480);
        const b64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        if (b64) wsRef.current.send(JSON.stringify({ type: 'video_frame', data: b64 }));
      }, 1000);
      setIsCameraActive(true);
    } catch (err) {
      onErrorRef.current?.(`Error al cambiar cámara: ${(err as Error).message}`);
    }
  }, [isCameraActive]);

  const disconnect = useCallback(() => {
    stopStreaming();
    stopCamera();
    stopScreenShare();
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
    setIsCallActive(false);
  }, [stopStreaming, stopCamera, stopScreenShare]);

  return {
    isConnected,
    isSessionReady,
    isCallActive,
    isMuted,
    isCameraActive,
    isScreenShareActive,
    cameraStreamRef: cameraStreamRef as MutableRefObject<MediaStream | null>,
    screenStreamRef: screenStreamRef as MutableRefObject<MediaStream | null>,
    connect,
    disconnect,
    startCall,
    endCall,
    toggleMute,
    startCamera,
    stopCamera,
    flipCamera,
    facingMode,
    startScreenShare,
    stopScreenShare
  };
}
