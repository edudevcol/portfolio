import React from 'react';
import GlbAvatar from './avatars/GlbAvatar';
import { AVATARS, DEFAULT_AVATAR_ID, type AvatarStatus } from './avatars.config';

export type AvatarId = string;
export type { AvatarStatus };

interface AvatarProps {
  avatarId?: AvatarId;
  volume?: number;
  mouthShape?: number;
  status?: AvatarStatus;
  width?: number;
  height?: number;
}

/**
 * Avatar — router dinámico que despacha al componente correcto según AVATARS config.
 * Los avatares GLB usan GlbAvatar genérico; los SVG usan su componente propio.
 */
export default function Avatar({ avatarId = DEFAULT_AVATAR_ID, volume = 0, mouthShape = 0, status = 'idle', width, height }: AvatarProps) {
  const entry = AVATARS.find(a => a.id === avatarId) ?? AVATARS[0];

  if (entry.glbPath) {
    return (
      <div className="select-none" style={{ display: 'inline-block' }}>
        <GlbAvatar glbPath={entry.glbPath} volume={volume} mouthShape={mouthShape} width={width} height={height} tPoseCorrection={entry.tPoseCorrection} rotationY={entry.rotationY} encuadre={entry.encuadre} />
      </div>
    );
  }

  if (entry.Component) {
    const Comp = entry.Component;
    return (
      <div className="select-none" style={{ display: 'inline-block' }}>
        <Comp volume={volume} mouthShape={mouthShape} status={status} />
      </div>
    );
  }

  return null;
}
