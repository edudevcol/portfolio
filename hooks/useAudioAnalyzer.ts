import { useRef, useCallback } from 'react';

interface VolumeData {
  jaw: number;
  shape: number;
}

interface BinRange {
  start: number;
  end: number;
}

/**
 * useAudioAnalyzer - Hook para analizar el volumen del audio en reproducción
 * Usa Web Audio API (AnalyserNode) para leer la amplitud en tiempo real
 * y disparar callbacks que actualizan el estado de la boca del avatar
 */
export function useAudioAnalyzer() {
  // Contexto de audio compartido para toda la sesión
  const audioCtxRef = useRef<AudioContext | null>(null);
  // Nodo analizador conectado al grafo de audio
  const analyserRef = useRef<AnalyserNode | null>(null);
  // ID del frame de requestAnimationFrame en curso
  const animFrameRef = useRef<number | null>(null);
  // Tiempo de inicio del próximo chunk a reproducir (para gapless playback)
  const nextPlayTimeRef = useRef<number>(0);
  // Nodos de audio activos (para poder detenerlos al interrumpir)
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  // Callback externo que recibe { jaw, shape } (0-1 cada uno)
  const onVolumeRef = useRef<((data: VolumeData) => void) | null>(null);
  // Rangos de bins precomputados para cada banda de frecuencia
  const jawBinsRef = useRef<BinRange>({ start: 2, end: 10 });
  const shapeBinsRef = useRef<BinRange>({ start: 10, end: 50 });

  /**
   * Inicializa el AudioContext y el AnalyserNode (una sola vez)
   */
  const initAudioContext = useCallback(() => {
    if (audioCtxRef.current) return;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtxRef.current = new AudioCtx();
    analyserRef.current = audioCtxRef.current.createAnalyser();
    analyserRef.current.fftSize = 512;
    analyserRef.current.smoothingTimeConstant = 0.4;
    // Conectar el analizador a la salida para que el audio sea audible
    analyserRef.current.connect(audioCtxRef.current.destination);

    // Precomputar rangos de bins según la tasa de muestreo real del contexto
    const sr = audioCtxRef.current.sampleRate;
    const binWidth = sr / 512;
    jawBinsRef.current = {
      start: Math.max(1, Math.floor(150 / binWidth)),
      end: Math.min(255, Math.floor(900 / binWidth))
    };
    shapeBinsRef.current = {
      start: Math.floor(900 / binWidth),
      end: Math.min(255, Math.floor(3500 / binWidth))
    };

    nextPlayTimeRef.current = audioCtxRef.current.currentTime;
    console.log('[AudioAnalyzer] AudioContext inicializado, sampleRate:', audioCtxRef.current.sampleRate,
      '| jawBins:', jawBinsRef.current, '| shapeBins:', shapeBinsRef.current);
  }, []);

  /**
   * Registra el callback que recibe el nivel de volumen (0-1)
   */
  const setOnVolume = useCallback((callback: (data: VolumeData) => void) => {
    onVolumeRef.current = callback;
  }, []);

  /**
   * Decodifica un chunk de PCM 24kHz (base64, Int16) y lo encola para reproducción.
   * Retorna la duración del chunk en segundos.
   * @param pcmBase64 - Audio PCM 24kHz mono en base64
   */
  const scheduleAudioChunk = useCallback((pcmBase64: string): number => {
    if (!audioCtxRef.current || !analyserRef.current) return 0;

    try {
      // 1. Decodificar base64 → bytes
      const binaryStr = atob(pcmBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // 2. Interpretar como Int16 PCM y convertir a Float32
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      // 3. Crear AudioBuffer a 24kHz (formato de salida de Gemini)
      const sampleRate = 24000;
      const audioBuffer = audioCtxRef.current.createBuffer(1, float32.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32);

      // 4. Crear BufferSourceNode y conectarlo al analizador
      const source = audioCtxRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyserRef.current);

      // Rastrear el nodo activo para poder detenerlo si hay interrupción
      activeSourcesRef.current.add(source);
      source.onended = () => activeSourcesRef.current.delete(source);

      // 5. Programar la reproducción de forma continua (gapless)
      const now = audioCtxRef.current.currentTime;
      const startTime = Math.max(now, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + audioBuffer.duration;

      return audioBuffer.duration;
    } catch (err) {
      console.error('[AudioAnalyzer] Error al decodificar chunk PCM:', err);
      return 0;
    }
  }, []);

  /**
   * Inicia el bucle de lectura del volumen con requestAnimationFrame
   */
  const startVolumeLoop = useCallback(() => {
    if (animFrameRef.current) return; // Ya está corriendo

    const dataArray = new Uint8Array(analyserRef.current?.frequencyBinCount || 128);

    const tick = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Banda de mandíbula: energía en frecuencias fundamentales de la voz (150-900 Hz)
      const { start: js, end: je } = jawBinsRef.current;
      let jawSum = 0;
      for (let i = js; i <= je; i++) jawSum += dataArray[i];
      const jawAvg = jawSum / (je - js + 1);
      const jaw = Math.min(jawAvg / 65, 1);

      // Banda de forma: ratio de energía alta vs baja (distingue E/I de O/A)
      const { start: ss, end: se } = shapeBinsRef.current;
      let shapeSum = 0;
      for (let i = ss; i <= se; i++) shapeSum += dataArray[i];
      const shapeAvg = shapeSum / (se - ss + 1);
      const shape = jaw > 0.06 ? Math.min(shapeAvg / Math.max(jawAvg, 1), 1) : 0;

      if (onVolumeRef.current) {
        onVolumeRef.current({ jaw, shape });
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    console.log('[AudioAnalyzer] Bucle de volumen iniciado');
  }, []);

  /**
   * Detiene el bucle de lectura del volumen
   */
  const stopVolumeLoop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    // Resetear a cero
    if (onVolumeRef.current) {
      onVolumeRef.current({ jaw: 0, shape: 0 });
    }
    console.log('[AudioAnalyzer] Bucle de volumen detenido');
  }, []);

  /**
   * Restablece el tiempo de reproducción (para una nueva respuesta)
   */
  const resetPlayTime = useCallback(() => {
    if (audioCtxRef.current) {
      nextPlayTimeRef.current = audioCtxRef.current.currentTime;
    }
  }, []);

  /**
   * Retorna el tiempo restante de audio programado (en ms).
   * Útil para calcular el delay exacto antes de reactivar el micrófono.
   */
  const getRemainingPlayTime = useCallback((): number => {
    if (!audioCtxRef.current) return 0;
    return Math.max(0, nextPlayTimeRef.current - audioCtxRef.current.currentTime) * 1000;
  }, []);

  /**
   * Detiene inmediatamente toda reproducción de audio (para interrupción del usuario).
   */
  const stopPlayback = useCallback(() => {
    activeSourcesRef.current.forEach(src => {
      try { src.stop(); } catch { /* ya terminó */ }
    });
    activeSourcesRef.current.clear();
    if (audioCtxRef.current) {
      nextPlayTimeRef.current = audioCtxRef.current.currentTime;
    }
  }, []);

  /**
   * Despierta el AudioContext si está suspendido (política de autoplay del navegador)
   */
  const resumeAudioContext = useCallback(async () => {
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
      console.log('[AudioAnalyzer] AudioContext reanudado');
    }
  }, []);

  return {
    initAudioContext,
    setOnVolume,
    scheduleAudioChunk,
    startVolumeLoop,
    stopVolumeLoop,
    resetPlayTime,
    getRemainingPlayTime,
    stopPlayback,
    resumeAudioContext,
    audioCtxRef
  };
}
