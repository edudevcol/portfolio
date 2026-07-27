import React from 'react';
import type { AvatarStatus } from './NovaAvatar.tsx';

interface KiraAvatarProps {
  volume?: number;
  mouthShape?: number;
  status?: AvatarStatus;
}

/**
 * KiraAvatar — Alienígena bioluminiscente
 * Piel lavanda, ojos enormes con brillo, antena, marcas luminosas
 */
export default function KiraAvatar({ volume = 0, mouthShape = 0, status = 'idle' }: KiraAvatarProps) {
  const open = volume;
  const mouthRy = 1.5 + open * 10;
  const mouthRx = 14 + open * 5 + mouthShape * 5;
  const lowerY = 148 + open * 10;

  const glowColor = ({ idle: '#C4B5FD', listening: '#A5F3FC', thinking: '#F0ABFC', speaking: '#6EE7B7' } as Record<AvatarStatus, string>)[status] ?? '#C4B5FD';

  return (
    <svg viewBox="0 0 200 240" width="260" height="312" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="k-skin" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="60%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </radialGradient>
        <radialGradient id="k-eye-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="40%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </radialGradient>
        <radialGradient id="k-pupil" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F0F9FF" />
          <stop offset="30%" stopColor={glowColor} />
          <stop offset="100%" stopColor="#030712" />
        </radialGradient>
        <radialGradient id="k-glow-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="k-body" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <filter id="k-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="k-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Halo exterior */}
      <ellipse cx="100" cy="125" rx="92" ry="92" fill="url(#k-glow-bg)" />

      {/* Cuerpo */}
      <path d="M 45 240 Q 48 210 72 205 L 84 202 Q 100 212 116 202 L 128 205 Q 152 210 155 240 Z"
        fill="url(#k-body)" />
      {/* Collar/joya en el pecho */}
      <ellipse cx="100" cy="206" rx="16" ry="5" fill="#7C3AED" opacity="0.6" />
      <ellipse cx="100" cy="205" rx="8" ry="4" fill={glowColor} opacity="0.8" filter="url(#k-glow)" />
      <ellipse cx="100" cy="205" rx="4" ry="2" fill="white" opacity="0.9" />

      {/* Marcas bioluminiscentes en el cuerpo */}
      <path d="M 60 215 Q 65 210 72 215" stroke={glowColor} strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#k-glow)" />
      <path d="M 128 215 Q 135 210 140 215" stroke={glowColor} strokeWidth="1.5" fill="none" opacity="0.7" filter="url(#k-glow)" />

      {/* Cuello largo y delgado */}
      <rect x="88" y="180" width="24" height="26" rx="12" fill="#B06AE0" />
      {/* Marcas en cuello */}
      <line x1="92" y1="186" x2="108" y2="186" stroke={glowColor} strokeWidth="1" opacity="0.5" />
      <line x1="94" y1="192" x2="106" y2="192" stroke={glowColor} strokeWidth="1" opacity="0.3" />

      {/* ── CARA (cabeza alargada/ovalada) ── */}
      <ellipse cx="100" cy="115" rx="62" ry="75" fill="url(#k-skin)" filter="url(#k-soft)" />

      {/* Marcas faciales bioluminiscentes */}
      <path d="M 46 105 Q 52 100 58 108" stroke={glowColor} strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#k-glow)" />
      <path d="M 154 105 Q 148 100 142 108" stroke={glowColor} strokeWidth="1.5" fill="none" opacity="0.6" filter="url(#k-glow)" />
      {/* Marcas en mejillas */}
      <ellipse cx="56" cy="125" rx="10" ry="6" fill={glowColor} opacity="0.2" filter="url(#k-glow)" />
      <ellipse cx="144" cy="125" rx="10" ry="6" fill={glowColor} opacity="0.2" filter="url(#k-glow)" />

      {/* ── ANTENA ── */}
      {/* Tallo */}
      <path d="M 100 42 Q 110 24 118 12" stroke="#B06AE0" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Orbe de la antena */}
      <circle cx="118" cy="10" r="9" fill={glowColor} opacity="0.3" filter="url(#k-glow)" />
      <circle cx="118" cy="10" r="6" fill={glowColor} filter="url(#k-glow)" />
      <circle cx="118" cy="10" r="3" fill="white" opacity="0.9" />
      {/* Segundo tallo decorativo */}
      <path d="M 98 44 Q 86 26 78 14" stroke="#B06AE0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
      <circle cx="78" cy="12" r="5" fill={glowColor} opacity="0.4" filter="url(#k-glow)" />
      <circle cx="78" cy="12" r="3" fill={glowColor} opacity="0.7" />

      {/* ── OREJAS/ALETAS LATERALES ── */}
      <path d="M 38 95 Q 24 110 28 130 Q 32 145 42 148 Q 38 132 40 118 Q 38 106 44 96 Z" fill="#B06AE0" />
      <path d="M 38 100 Q 28 115 32 130" stroke={glowColor} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#k-glow)" />
      <path d="M 162 95 Q 176 110 172 130 Q 168 145 158 148 Q 162 132 160 118 Q 162 106 156 96 Z" fill="#B06AE0" />
      <path d="M 162 100 Q 172 115 168 130" stroke={glowColor} strokeWidth="1.5" fill="none" opacity="0.5" filter="url(#k-glow)" />

      {/* ── OJOS ENORMES ── */}
      {/* Sombra/base */}
      <ellipse cx="72" cy="105" rx="22" ry="24" fill="#1E1B4B" opacity="0.5" />
      <ellipse cx="128" cy="105" rx="22" ry="24" fill="#1E1B4B" opacity="0.5" />
      {/* Esclera / iris grande */}
      <ellipse cx="72" cy="104" rx="20" ry="22" fill="url(#k-eye-bg)" />
      <ellipse cx="128" cy="104" rx="20" ry="22" fill="url(#k-eye-bg)" />
      {/* Pupila vertical luminosa */}
      <ellipse cx="72" cy="104" rx="10" ry="14" fill="url(#k-pupil)" filter="url(#k-glow)" />
      <ellipse cx="128" cy="104" rx="10" ry="14" fill="url(#k-pupil)" filter="url(#k-glow)" />
      {/* Pupila vertical oscura central */}
      <ellipse cx="72" cy="104" rx="4" ry="10" fill="#030712" />
      <ellipse cx="128" cy="104" rx="4" ry="10" fill="#030712" />
      {/* Brillo principal */}
      <ellipse cx="77" cy="97" rx="5" ry="5" fill="white" opacity="0.95" />
      <ellipse cx="68" cy="108" rx="2" ry="2" fill="white" opacity="0.5" />
      <ellipse cx="133" cy="97" rx="5" ry="5" fill="white" opacity="0.95" />
      <ellipse cx="124" cy="108" rx="2" ry="2" fill="white" opacity="0.5" />
      {/* Halo alrededor del ojo */}
      <ellipse cx="72" cy="104" rx="22" ry="24" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.4" filter="url(#k-glow)" />
      <ellipse cx="128" cy="104" rx="22" ry="24" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.4" filter="url(#k-glow)" />

      {/* ── NARIZ pequeña ── */}
      <ellipse cx="100" cy="138" rx="5" ry="3" fill="#9333EA" opacity="0.4" />
      <path d="M 96 138 Q 100 142 104 138" stroke="#9333EA" strokeWidth="1.2" fill="none" opacity="0.5" />

      {/* ── BOCA ── */}
      {/* Sombra */}
      <ellipse cx="100" cy={143 + open * 5} rx={mouthRx + 2} ry={mouthRy + 2}
        fill="#6B21A8" style={{ transition: 'all 0.1s ease' }} />
      {/* Interior */}
      <ellipse cx="100" cy={143 + open * 6} rx={mouthRx} ry={mouthRy}
        fill="#1E1B4B" style={{ transition: 'all 0.1s ease' }} />
      {open > 0.15 && (
        <ellipse cx="100" cy={140 + open * 4} rx={mouthRx - 3} ry={mouthRy * 0.5}
          fill={glowColor} opacity="0.4" style={{ transition: 'all 0.1s ease' }} />
      )}
      {/* Labio superior */}
      <path d={`M ${100 - mouthRx - 1} 141 Q ${100 - mouthRx * 0.4} 136 100 138 Q ${100 + mouthRx * 0.4} 136 ${100 + mouthRx + 1} 141`}
        fill="#C084FC" style={{ transition: 'all 0.1s ease' }} />
      {/* Labio inferior */}
      <path d={`M ${100 - mouthRx - 1} 141 Q 100 ${lowerY} ${100 + mouthRx + 1} 141`}
        fill="#D8B4FE" style={{ transition: 'all 0.1s ease' }} />
      {/* Brillo del labio */}
      <ellipse cx="100" cy="138" rx={mouthRx * 0.5} ry="2" fill="white" opacity="0.2" />
    </svg>
  );
}
