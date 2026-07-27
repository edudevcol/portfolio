import React from 'react';
import { useGLTF } from '@react-three/drei';
import { type AvatarStatus } from './avatars/NovaAvatar';

export type { AvatarStatus };

export interface AvatarEntry {
  id: string;
  name: string;
  description: string;
  accent: string;
  ring: string;
  /** Emoji mostrado como miniatura cuando no hay Component (avatares GLB) */
  thumbnail?: string;
  /** Ruta a un .glb en /public/models/ — se renderiza con GlbAvatar genérico */
  glbPath?: string;
  /** Activar cuando el .glb viene en T-pose (brazos horizontales) — típico en exports de Avaturn */
  tPoseCorrection?: boolean;
  /** Rotación Y en radianes — corrige orientación cuando la animación gira el modelo */
  rotationY?: number;
  /** Componente React propio — para avatares SVG/procedurales */
  Component?: React.ComponentType<{ volume?: number; mouthShape?: number; status?: AvatarStatus }>;
  /**
   * Nombre de voz Gemini TTS (30 voces disponibles).
   * Escucha todas las voces en: https://aistudio.google.com/generate-speech
   * Ejemplos: "Sadachbia" (masculina), "Charon" (femenina), "Kore" (neutral), "Aoede" (femenina suave)
   */
  voice?: string;
}

// ════════════════════════════════════════════════════════════════
//  CATÁLOGO DE AVATARES
//
//  Para añadir un avatar GLB:
//  1. Copia tu archivo .glb a  public/models/mi-avatar.glb
//  2. Agrega una entrada al array con  glbPath: '/models/mi-avatar.glb'
//  ¡Sin crear ningún componente nuevo!
//
//  Para añadir un avatar personalizado (SVG/React):
//  1. Crea tu componente en  components/avatars/
//  2. Agrégalo al array con  Component: MiAvatarComponent
// ════════════════════════════════════════════════════════════════
export const AVATARS: AvatarEntry[] = [

  // ── Avatares GLB 3D ───────────────────────────────────────────
  // Para añadir más: copia el .glb a public/models/ y agrega una entrada
  {
    id: 'edu',
    name: 'Edu',
    description: 'Humano 3D',
    accent: 'from-teal-400 to-cyan-500',
    ring: 'ring-teal-400',
    thumbnail: '🧑',
    glbPath: '/models/edu.glb',
    tPoseCorrection: true,
    rotationY: 0.5,
    voice: 'Sadachbia',
  },

  {
    id: 'sophia',
    name: 'Sophia',
    description: 'Humana 3D',
    accent: 'from-rose-400 to-pink-500',
    ring: 'ring-rose-400',
    thumbnail: '👩',
    glbPath: '/models/sophia.glb',
    voice: 'Aoede', //  Voz femenina suave (la que tenías antes)
  },

];

export const DEFAULT_AVATAR_ID = AVATARS[0].id;

// Precargar todos los GLBs al arrancar el módulo, antes de que React monte cualquier componente
AVATARS.forEach(a => {
  if (a.glbPath) {
    try { useGLTF.preload(a.glbPath); } catch (_) { /* modelo aún no disponible */ }
  }
});
