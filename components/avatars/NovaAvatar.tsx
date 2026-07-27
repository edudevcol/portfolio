import React from 'react';

export type AvatarStatus = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface NovaAvatarProps {
  volume?: number;
  mouthShape?: number;
  status?: AvatarStatus;
}

/**
 * NovaAvatar — Robot IA futurista
 * Cara metálica, ojos LED cyan pulsantes, boca digital tipo display
 */
export default function NovaAvatar({ volume = 0, mouthShape = 0, status = 'idle' }: NovaAvatarProps) {
  const open = volume;
  const mouthRy = 2 + open * 11;
  const mouthRx = 17 + open * 3 + mouthShape * 4;

  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  // Color del LED según estado
  const ledColor = ({ idle: '#60A5FA', listening: '#34D399', thinking: '#A78BFA', speaking: '#22D3EE' } as Record<AvatarStatus, string>)[status] ?? '#60A5FA';

  return (
    <svg viewBox="0 0 200 230" width="260" height="299" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="n-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id="n-face" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="n-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <radialGradient id="n-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ledColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={ledColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="n-eye-glow" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="50%" stopColor={ledColor} />
          <stop offset="100%" stopColor="#0E1A2E" />
        </radialGradient>
        <filter id="n-led" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="n-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Halo exterior */}
      <ellipse cx="100" cy="118" rx="95" ry="95" fill="url(#n-glow)" />

      {/* Cuerpo */}
      <path d="M 42 230 L 48 202 Q 68 196 100 196 Q 132 196 152 202 L 158 230 Z" fill="url(#n-body)" />
      {/* Panel del pecho */}
      <rect x="72" y="200" width="56" height="20" rx="4" fill="#1E293B" opacity="0.8" />
      <rect x="78" y="204" width="8" height="8" rx="1" fill={ledColor} opacity="0.9" />
      <rect x="90" y="204" width="8" height="8" rx="1" fill={ledColor} opacity="0.6" />
      <rect x="102" y="204" width="8" height="8" rx="1" fill={ledColor} opacity="0.3" />
      <rect x="114" y="204" width="8" height="8" rx="1" fill="#475569" opacity="0.5" />

      {/* Cuello con conectores */}
      <rect x="82" y="174" width="36" height="28" rx="4" fill="#64748B" />
      <rect x="86" y="178" width="8" height="4" rx="2" fill="#1E293B" />
      <rect x="106" y="178" width="8" height="4" rx="2" fill="#1E293B" />
      <line x1="82" y1="184" x2="118" y2="184" stroke="#475569" strokeWidth="1" />

      {/* ── CRÁNEO / CASCO ── */}
      <rect x="30" y="34" width="140" height="82" rx="70" fill="url(#n-top)" />
      {/* Panel lateral izquierdo */}
      <rect x="30" y="60" width="14" height="40" rx="7" fill="#1E293B" />
      <circle cx="37" cy="68" r="4" fill={ledColor} filter="url(#n-led)" opacity={isListening ? 1 : 0.6} />
      <circle cx="37" cy="80" r="3" fill={ledColor} opacity={isSpeaking ? 1 : 0.3} />
      <circle cx="37" cy="90" r="3" fill={ledColor} opacity="0.2" />
      {/* Panel lateral derecho */}
      <rect x="156" y="60" width="14" height="40" rx="7" fill="#1E293B" />
      <circle cx="163" cy="68" r="4" fill={ledColor} filter="url(#n-led)" opacity={isListening ? 1 : 0.6} />
      <circle cx="163" cy="80" r="3" fill={ledColor} opacity={isSpeaking ? 1 : 0.3} />
      <circle cx="163" cy="90" r="3" fill={ledColor} opacity="0.2" />
      {/* Antena */}
      <line x1="100" y1="34" x2="100" y2="14" stroke="#94A3B8" strokeWidth="3" />
      <circle cx="100" cy="10" r="6" fill={ledColor} filter="url(#n-led)"
        style={{ animation: 'pulse 1.5s infinite' }} />
      <circle cx="100" cy="10" r="3" fill="white" opacity="0.8" />

      {/* ── CARA ── */}
      <rect x="34" y="60" width="132" height="116" rx="20" fill="url(#n-face)" />
      {/* Bordes metálicos */}
      <rect x="34" y="60" width="132" height="116" rx="20"
        fill="none" stroke="#CBD5E1" strokeWidth="1.5" opacity="0.4" />
      {/* Líneas de panel */}
      <line x1="34" y1="100" x2="166" y2="100" stroke="#94A3B8" strokeWidth="0.5" opacity="0.4" />
      <line x1="100" y1="60" x2="100" y2="76" stroke="#94A3B8" strokeWidth="0.5" opacity="0.4" />

      {/* ── OJOS LED ── */}
      {/* Caja del ojo izquierdo */}
      <rect x="50" y="78" width="42" height="28" rx="8" fill="#0F172A" />
      <rect x="50" y="78" width="42" height="28" rx="8" fill="none" stroke={ledColor} strokeWidth="1.5" opacity="0.6" />
      {/* Iris LED izquierdo */}
      <circle cx="71" cy="92" r="10" fill={ledColor} opacity="0.15" />
      <circle cx="71" cy="92" r="8" fill="url(#n-eye-glow)" filter="url(#n-led)" />
      <circle cx="71" cy="92" r="4" fill="white" opacity="0.9" />
      <circle cx="74" cy="89" r="2" fill="white" />

      {/* Caja del ojo derecho */}
      <rect x="108" y="78" width="42" height="28" rx="8" fill="#0F172A" />
      <rect x="108" y="78" width="42" height="28" rx="8" fill="none" stroke={ledColor} strokeWidth="1.5" opacity="0.6" />
      {/* Iris LED derecho */}
      <circle cx="129" cy="92" r="10" fill={ledColor} opacity="0.15" />
      <circle cx="129" cy="92" r="8" fill="url(#n-eye-glow)" filter="url(#n-led)" />
      <circle cx="129" cy="92" r="4" fill="white" opacity="0.9" />
      <circle cx="132" cy="89" r="2" fill="white" />

      {/* ── PANEL DE BOCA (display digital) ── */}
      <rect x="66" y="118" width="68" height="34" rx="8" fill="#0F172A" />
      <rect x="66" y="118" width="68" height="34" rx="8" fill="none" stroke={ledColor} strokeWidth="1.5" opacity="0.5" />

      {/* Apertura digital de la boca */}
      <ellipse cx="100" cy={133 + open * 4}
        rx={mouthRx} ry={mouthRy}
        fill={ledColor} opacity="0.85"
        filter="url(#n-led)"
        style={{ transition: 'all 0.1s ease' }} />
      {/* Líneas horizontales tipo display */}
      {[0, 1, 2].map(i => (
        <line key={i}
          x1={100 - mouthRx + 2} y1={128 + i * 5}
          x2={100 + mouthRx - 2} y2={128 + i * 5}
          stroke="#0F172A" strokeWidth="1" opacity={open < 0.1 ? 0 : 0.4}
          style={{ transition: 'opacity 0.1s' }} />
      ))}
      {/* Brillo del display */}
      <ellipse cx="100" cy="118" rx="30" ry="6" fill={ledColor} opacity="0.08" />

      {/* Tornillos decorativos */}
      {([[44, 64], [156, 64], [44, 166], [156, 166]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill="#334155" />
          <circle cx={cx} cy={cy} r="3" fill="#1E293B" />
          <line x1={cx - 2} y1={cy} x2={cx + 2} y2={cy} stroke="#64748B" strokeWidth="0.8" />
          <line x1={cx} y1={cy - 2} x2={cx} y2={cy + 2} stroke="#64748B" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}
