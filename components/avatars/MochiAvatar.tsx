import React from 'react';
import type { AvatarStatus } from './NovaAvatar.tsx';

interface MochiAvatarProps {
  volume?: number;
  status?: AvatarStatus;
}

/**
 * MochiAvatar — Gato antropomórfico kawaii
 * Pelaje blanco/crema, orejas felinas, ojos verdes con pupila vertical, bigotes
 */
export default function MochiAvatar({ volume = 0, status = 'idle' }: MochiAvatarProps) {
  const mouthOpen = volume < 0.05 ? 0 : volume < 0.35 ? 0.4 : 1;
  const mouthRy   = 1 + mouthOpen * 10;
  const mouthRx   = 13 + mouthOpen * 5;
  const lowerY    = 133 + mouthOpen * 10;

  const glowColor = ({ idle: '#FDE68A', listening: '#A7F3D0', thinking: '#DDD6FE', speaking: '#FCA5A5' } as Record<AvatarStatus, string>)[status] ?? '#FDE68A';

  return (
    <svg viewBox="0 0 200 230" width="260" height="299" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="m-fur" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFBF0"/>
          <stop offset="65%" stopColor="#FEF3C7"/>
          <stop offset="100%" stopColor="#F6D860"/>
        </radialGradient>
        <radialGradient id="m-ear-inner" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FCA5A5"/>
          <stop offset="100%" stopColor="#F87171"/>
        </radialGradient>
        <radialGradient id="m-iris" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#6EE7B7"/>
          <stop offset="50%" stopColor="#10B981"/>
          <stop offset="100%" stopColor="#064E3B"/>
        </radialGradient>
        <radialGradient id="m-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={glowColor} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="m-body" x1="0" y1="0" x2="0.1" y2="1">
          <stop offset="0%" stopColor="#FEF3C7"/>
          <stop offset="100%" stopColor="#FDE68A"/>
        </linearGradient>
        <filter id="m-soft" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
        <filter id="m-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#D97706" floodOpacity="0.25"/>
        </filter>
      </defs>

      {/* Halo */}
      <ellipse cx="100" cy="118" rx="90" ry="90" fill="url(#m-glow)"/>

      {/* Cuerpo con jersey */}
      <path d="M 42 230 Q 44 205 68 200 L 80 198 Q 100 208 120 198 L 132 200 Q 156 205 158 230 Z"
        fill="#F87171"/>
      {/* Franja del jersey */}
      <path d="M 52 216 Q 100 220 148 216 L 148 222 Q 100 226 52 222 Z" fill="#FB923C" opacity="0.7"/>
      {/* Detalle cuello del jersey */}
      <path d="M 80 198 Q 100 210 120 198 Q 114 202 100 204 Q 86 202 80 198 Z" fill="#EF4444" opacity="0.5"/>

      {/* Cuello */}
      <rect x="84" y="174" width="32" height="26" rx="10" fill="#FEF3C7"/>

      {/* ── OREJAS ── */}
      {/* Oreja izquierda */}
      <path d="M 48 68 L 34 30 L 72 54 Z" fill="#FEF3C7"/>
      <path d="M 52 64 L 40 36 L 68 56 Z" fill="url(#m-ear-inner)" opacity="0.85"/>
      {/* Oreja derecha */}
      <path d="M 152 68 L 166 30 L 128 54 Z" fill="#FEF3C7"/>
      <path d="M 148 64 L 160 36 L 132 56 Z" fill="url(#m-ear-inner)" opacity="0.85"/>

      {/* ── CARA ── */}
      <ellipse cx="100" cy="112" rx="66" ry="72" fill="url(#m-fur)" filter="url(#m-shadow)"/>

      {/* Parches de color en mejillas (manchas de gato) */}
      <ellipse cx="60" cy="118" rx="20" ry="16" fill="#FDE68A" opacity="0.6"/>
      <ellipse cx="140" cy="118" rx="20" ry="16" fill="#FDE68A" opacity="0.6"/>
      {/* Rubor */}
      <ellipse cx="58" cy="124" rx="14" ry="9" fill="#FCA5A5" opacity="0.45"/>
      <ellipse cx="142" cy="124" rx="14" ry="9" fill="#FCA5A5" opacity="0.45"/>

      {/* Marca en la frente */}
      <path d="M 88 74 Q 100 68 112 74 Q 106 70 100 71 Q 94 70 88 74 Z"
        fill="#F6D860" opacity="0.5"/>

      {/* ── CEJAS ── */}
      <path d="M 62 86 Q 74 80 86 84" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" fill="none"
        transform={status === 'thinking' ? 'translate(0,-3)' : ''}
        style={{ transition: 'transform 0.3s' }}/>
      <path d="M 114 84 Q 126 80 138 86" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" fill="none"
        transform={status === 'thinking' ? 'translate(0,-3)' : ''}
        style={{ transition: 'transform 0.3s' }}/>

      {/* ── OJOS ── */}
      {/* Blanco del ojo */}
      <ellipse cx="72" cy="100" rx="16" ry="17" fill="white"/>
      <ellipse cx="128" cy="100" rx="16" ry="17" fill="white"/>
      {/* Iris verde */}
      <ellipse cx="72" cy="100" rx="12" ry="13" fill="url(#m-iris)"/>
      <ellipse cx="128" cy="100" rx="12" ry="13" fill="url(#m-iris)"/>
      {/* Pupila vertical de gato */}
      <ellipse cx="72" cy="100" rx="4" ry="11" fill="#052E16"/>
      <ellipse cx="128" cy="100" rx="4" ry="11" fill="#052E16"/>
      {/* Brillo del ojo */}
      <ellipse cx="76" cy="95" rx="4" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="68" cy="106" rx="2" ry="2" fill="white" opacity="0.5"/>
      <ellipse cx="132" cy="95" rx="4" ry="4" fill="white" opacity="0.9"/>
      <ellipse cx="124" cy="106" rx="2" ry="2" fill="white" opacity="0.5"/>
      {/* Línea de párpado superior */}
      <path d="M 56 97 Q 72 90 88 97" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M 112 97 Q 128 90 144 97" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" fill="none"/>

      {/* ── NARIZ DE GATO ── */}
      {/* Nariz triangular */}
      <path d="M 96 120 L 100 116 L 104 120 Q 100 123 96 120 Z" fill="#F87171"/>
      <path d="M 96 120 L 100 116 L 104 120" stroke="#EF4444" strokeWidth="1" fill="none"/>
      {/* Filtro (philtrum) */}
      <line x1="100" y1="120" x2="100" y2="128" stroke="#D97706" strokeWidth="1.2" opacity="0.5"/>

      {/* ── BIGOTES ── */}
      {/* Izquierdos */}
      <line x1="42" y1="124" x2="82" y2="128" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
      <line x1="40" y1="130" x2="80" y2="131" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
      <line x1="42" y1="136" x2="82" y2="134" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
      {/* Derechos */}
      <line x1="158" y1="124" x2="118" y2="128" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
      <line x1="160" y1="130" x2="120" y2="131" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
      <line x1="158" y1="136" x2="118" y2="134" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>

      {/* ── BOCA DE GATO ── */}
      {/* Sombra */}
      <ellipse cx="100" cy={130 + mouthOpen * 5} rx={mouthRx + 2} ry={mouthRy + 2}
        fill="#D97706" style={{ transition: 'all 0.1s ease' }}/>
      {/* Interior */}
      <ellipse cx="100" cy={130 + mouthOpen * 6} rx={mouthRx} ry={mouthRy}
        fill="#450A0A" style={{ transition: 'all 0.1s ease' }}/>
      {/* Dientes */}
      {mouthOpen > 0.25 && (
        <ellipse cx="100" cy={127 + mouthOpen * 4} rx={mouthRx - 3} ry={mouthRy * 0.5}
          fill="white" opacity={mouthOpen > 0.7 ? 0.95 : 0.7} style={{ transition: 'all 0.1s ease' }}/>
      )}
      {/* Labio superior curvo (boca de gato en W) */}
      {mouthOpen < 0.1 ? (
        <>
          <path d={`M ${100 - mouthRx} 128 Q ${100 - mouthRx * 0.5} 124 100 126 Q ${100 + mouthRx * 0.5} 124 ${100 + mouthRx} 128`}
            fill="#F87171" style={{ transition: 'all 0.1s ease' }}/>
          {/* Curva W característica del gato */}
          <path d="M 82 128 Q 88 132 96 130 Q 100 132 104 130 Q 112 132 118 128"
            stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </>
      ) : (
        <>
          <path d={`M ${100 - mouthRx - 1} 128 Q ${100 - mouthRx * 0.4} 122 100 124 Q ${100 + mouthRx * 0.4} 122 ${100 + mouthRx + 1} 128`}
            fill="#F87171" style={{ transition: 'all 0.1s ease' }}/>
          <path d={`M ${100 - mouthRx - 1} 128 Q 100 ${lowerY} ${100 + mouthRx + 1} 128`}
            fill="#FCA5A5" style={{ transition: 'all 0.1s ease' }}/>
        </>
      )}

      {/* Cola (visible parcialmente en la parte inferior) */}
      <path d="M 148 224 Q 170 210 176 195 Q 180 182 172 178 Q 168 190 164 200 Q 158 214 144 220 Z"
        fill="#FEF3C7" opacity="0.7"/>
      <path d="M 148 224 Q 170 210 176 195" fill="none" stroke="#F6D860" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
}
