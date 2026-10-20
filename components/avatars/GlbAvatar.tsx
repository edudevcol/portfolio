import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useGraph, useThree } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/** Iluminación de estudio procedural: reflejos suaves y profundidad en la piel, sin descargar HDRs. */
function AmbienteEstudio({ intensidad = 0.45 }: { intensidad?: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const prev = scene.environment;
    scene.environment = env;
    (scene as any).environmentIntensity = intensidad;
    return () => { scene.environment = prev; env.dispose(); pmrem.dispose(); };
  }, [gl, scene, intensidad]);
  return null;
}

// Morph targets ARKit/Oculus — Streamoji y RPM los incluyen
const MOUTH_MORPHS = ['viseme_aa', 'jawOpen', 'viseme_O', 'mouthOpen'];
// Nombres comunes de hueso mandíbula — fallback para GLBs sin morph targets
const JAW_BONES = ['jaw', 'Jaw', 'Jaw_M', 'jaw_', 'head_jaw', 'Jawbone', 'lower_jaw', 'chin', 'Chin'];
// Nombres comunes del hueso de cabeza — para micro-movimiento idle
const HEAD_BONES = ['Head', 'head', 'Head_M', 'Bip01 Head', 'mixamorigHead'];
// Hueso de columna para animación de respiración
const SPINE_BONES = ['Spine', 'spine', 'Spine1', 'spine1', 'Bip01 Spine', 'mixamorigSpine'];
// Huesos de brazos superiores — para corrección de T-pose (Mixamo, VRM/Avaturn, Unity)
const ARM_L_BONES = [
  'LeftArm', 'mixamorigLeftArm', 'Bip01 L UpperArm', 'Left_arm', 'upperarm_l', 'UpperArm_L',
  'J_Bip_L_UpperArm', 'LeftUpperArm', 'upper_arm_l', 'Upper_Arm_L', 'UpperArmLeft',
];
const ARM_R_BONES = [
  'RightArm', 'mixamorigRightArm', 'Bip01 R UpperArm', 'Right_arm', 'upperarm_r', 'UpperArm_R',
  'J_Bip_R_UpperArm', 'RightUpperArm', 'upper_arm_r', 'Upper_Arm_R', 'UpperArmRight',
];

function isLeftUpperArm(name: string) {
  const n = name.toLowerCase();
  if (ARM_L_BONES.some(b => b.toLowerCase() === n)) return true;
  // broad fallback: contiene "arm" y "left" / "_l", sin "fore"/"lower"/"hand"
  return n.includes('arm') && !n.includes('fore') && !n.includes('lower') && !n.includes('hand')
    && (n.includes('left') || n.includes('_l') || n.endsWith('l'));
}
function isRightUpperArm(name: string) {
  const n = name.toLowerCase();
  if (ARM_R_BONES.some(b => b.toLowerCase() === n)) return true;
  return n.includes('arm') && !n.includes('fore') && !n.includes('lower') && !n.includes('hand')
    && (n.includes('right') || n.includes('_r') || n.endsWith('r'));
}

type BlinkPhase = 'idle' | 'closing' | 'paused' | 'opening';

interface GLBSceneProps {
  glbPath: string;
  volumeRef: React.RefObject<number>;
  shapeRef: React.RefObject<number>;
  tPoseCorrection?: boolean;
  rotationY?: number;
  /** Posición vertical y escala del modelo en cuadro (bustos estáticos). */
  encuadre?: { y?: number; escala?: number };
}

function GLBScene({ glbPath, volumeRef, shapeRef, tPoseCorrection = false, rotationY = 0, encuadre }: GLBSceneProps) {
  const { scene, animations } = useGLTF(glbPath);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  useGraph(clone);
  const jawRef = useRef<THREE.Object3D | null>(null);
  const headRef = useRef<THREE.Object3D | null>(null);
  const spineRef = useRef<THREE.Object3D | null>(null);
  // Parpadeos
  const blinkPhase = useRef<BlinkPhase>('idle');
  const blinkTimer = useRef(2 + Math.random() * 3);
  const blinkVal = useRef(0);
  // Cejas reactivas al hablar
  const browCurrent = useRef(0);
  // Meshes con morph targets — cacheados al cargar el modelo
  const meshesRef = useRef<THREE.Mesh[]>([]);
  // Pose de reposo de huesos — para animar relativo a ella
  const estaticoRef = useRef(false);
  const headRestY = useRef(0);
  const headRestZ = useRef(0);
  const spineRestX = useRef(0);
  // Animación embebida (cuando el GLB incluye clips)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const hasAnimations = animations && animations.length > 0;
  const armLRef = useRef<THREE.Object3D | null>(null);
  const armRRef = useRef<THREE.Object3D | null>(null);
  const armLSpreadQ = useRef<THREE.Quaternion | null>(null);
  const armRSpreadQ = useRef<THREE.Quaternion | null>(null);

  useEffect(() => {
    clone.traverse((node: THREE.Object3D) => {
      const isBone = (node as THREE.Bone).isBone;
      if (!jawRef.current && isBone && JAW_BONES.some(
        n => node.name === n ||
          node.name.toLowerCase().includes('jaw') ||
          node.name.toLowerCase().includes('chin')
      )) {
        jawRef.current = node;
      }
      if (!headRef.current && isBone && HEAD_BONES.some(
        n => node.name === n || node.name.toLowerCase() === 'head'
      )) {
        headRef.current = node;
        headRestY.current = node.rotation.y;
        headRestZ.current = node.rotation.z;
      }
      if (!spineRef.current && isBone && SPINE_BONES.some(
        n => node.name === n || node.name.toLowerCase().startsWith('spine')
      )) {
        spineRef.current = node;
        spineRestX.current = node.rotation.x;
      }
      if (!armLRef.current && isBone && isLeftUpperArm(node.name)) armLRef.current = node;
      if (!armRRef.current && isBone && isRightUpperArm(node.name)) armRRef.current = node;
    });
    // Cachear meshes con morph targets para no traversar en cada frame
    const meshes: THREE.Mesh[] = [];
    clone.traverse((node: THREE.Object3D) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.morphTargetDictionary) meshes.push(mesh);
    });
    meshesRef.current = meshes;

    // Diagnóstico: muestra huesos y morph targets en consola (útil para ajustar el avatar)
    const boneNames: string[] = [];
    clone.traverse((node: THREE.Object3D) => {
      if ((node as THREE.Bone).isBone) boneNames.push(node.name);
    });
    estaticoRef.current = boneNames.length === 0 && !(animations && animations.length > 0);
    console.log(`[GlbAvatar] ${glbPath} — huesos (${boneNames.length}):`, boneNames.join(', '));
    if (meshes.length === 0) {
      console.warn(`[GlbAvatar] ${glbPath} — NO hay meshes con morph targets. Labios no se moverán.`);
    } else {
      meshes.forEach(m => {
        const names = Object.keys(m.morphTargetDictionary!);
        console.log(`[GlbAvatar] mesh "${m.name}" — ${names.length} morph targets:`, names.join(', '));
      });
    }

    // Animación embebida — reproduce el primer clip en loop (idle, etc.)
    if (mixerRef.current) {
      mixerRef.current.stopAllAction();
      mixerRef.current = null;
    }
    if (hasAnimations) {
      const mixer = new THREE.AnimationMixer(clone);
      animations.forEach(clip => {
        const action = mixer.clipAction(clip);
        action.timeScale = 0; // congela en pose natural — sin movimientos
        action.play();
      });
      mixerRef.current = mixer;
      console.log(`[GlbAvatar] ${glbPath} — ${animations.length} animación(es) encontrada(s):`, animations.map(a => a.name).join(', '));
      // Precompute arm spread: small outward rotation applied every frame after mixer resets bone poses
      mixer.update(0);
      clone.updateMatrixWorld(true);
      const SPREAD = 0.12; // ~7° — brazos ligeramente separados del cuerpo
      const computeSpread = (bone: THREE.Object3D | null, zAngle: number) => {
        if (!bone) return null;
        const wt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), zAngle);
        const pq = new THREE.Quaternion();
        bone.parent?.getWorldQuaternion(pq);
        const bq = new THREE.Quaternion();
        bone.getWorldQuaternion(bq);
        return pq.clone().invert().multiply(wt.multiply(bq));
      };
      armLSpreadQ.current = computeSpread(armLRef.current, SPREAD);
      armRSpreadQ.current = computeSpread(armRRef.current, -SPREAD);
    }


    // Corrección de T-pose solo si no hay animación (la animación posiciona los huesos mejor)
    if (tPoseCorrection && !hasAnimations) {
      clone.updateMatrixWorld(true);
      let corrected = 0;
      clone.traverse((node: THREE.Object3D) => {
        if (!(node as THREE.Bone).isBone) return;
        const isLeft = isLeftUpperArm(node.name);
        const isRight = !isLeft && isRightUpperArm(node.name);
        if (!isLeft && !isRight) return;

        // Rotar el brazo hacia abajo en espacio mundo girando alrededor del eje Z global.
        // Brazo izquierdo apunta en -X → rotación +Z lo baja hacia -Y.
        // Brazo derecho apunta en +X → rotación -Z lo baja hacia -Y.
        const tiltAngle = isLeft ? -1.1 : 1.1;
        const worldTilt = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), tiltAngle);

        const parentWorldQ = new THREE.Quaternion();
        node.parent?.getWorldQuaternion(parentWorldQ);

        const boneWorldQ = new THREE.Quaternion();
        node.getWorldQuaternion(boneWorldQ);

        // Premultiplicar = aplicar en espacio mundo
        const newLocalQ = parentWorldQ.clone().invert().multiply(worldTilt.multiply(boneWorldQ));
        node.quaternion.copy(newLocalQ);

        corrected++;
        console.log(`[GlbAvatar] T-pose fix (mundo) → ${isLeft ? 'brazo izq' : 'brazo der'}: "${node.name}" tilt ${tiltAngle > 0 ? '+' : ''}${tiltAngle.toFixed(2)} rad`);
      });
      if (corrected === 0) {
        console.warn(`[GlbAvatar] tPoseCorrection=true pero NO se encontraron huesos de brazo.`);
      }
    }
    return () => { mixerRef.current?.stopAllAction(); mixerRef.current = null; };
  }, [clone, tPoseCorrection, hasAnimations, animations]);

  useFrame((state, delta) => {
    // Avanzar animación embebida
    mixerRef.current?.update(delta);
    // Brazos ligeramente separados — se aplica cada frame porque el mixer resetea los huesos
    if (armLRef.current && armLSpreadQ.current) armLRef.current.quaternion.copy(armLSpreadQ.current);
    if (armRRef.current && armRSpreadQ.current) armRRef.current.quaternion.copy(armRSpreadQ.current);

    // ── TEST: gestos de brazos al hablar ─────────────────────────────────
    const baseVolume = volumeRef.current;
    const sensibility = 0.4;
    const maxOpen = 0.5;
    const openVelocity = 0.45;
    const closeVelocity = 0.92; // cierra mucho más rápido que abre

    let open = 0;
    if (baseVolume > 0.05) {
      open = (baseVolume * sensibility) * maxOpen;
    }

    // Estrategia 1: morph targets (meshes cacheados en useEffect)
    const meshesWithMorphs = meshesRef.current;
    let morphDriven = false;
    meshesWithMorphs.forEach(mesh => {
      MOUTH_MORPHS.forEach(name => {
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
        const idx = mesh.morphTargetDictionary[name];
        if (idx === undefined) return;
        const cur = mesh.morphTargetInfluences[idx];
        const vel = open < cur ? closeVelocity : openVelocity;
        mesh.morphTargetInfluences[idx] = THREE.MathUtils.lerp(cur, open, vel);
        morphDriven = true;
      });
    });

    // Capa vocálica: spread (E/I) y round (U/O) basados en formantes de audio
    if (morphDriven && baseVolume > 0.05) {
      const sp = shapeRef.current; // 0 = redondeado (O/U), 1 = spread (E/I)
      const eHint = Math.max(0, sp - 0.5) * 0.3 * open;
      const uHint = Math.max(0, 0.45 - sp) * 0.35 * (1 - open / maxOpen);
      meshesWithMorphs.forEach(mesh => {
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
        const infl = mesh.morphTargetInfluences;
        const dict = mesh.morphTargetDictionary;
        if (dict['viseme_E'] !== undefined) infl[dict['viseme_E']] = THREE.MathUtils.lerp(infl[dict['viseme_E']], eHint, openVelocity);
        if (dict['viseme_I'] !== undefined) infl[dict['viseme_I']] = THREE.MathUtils.lerp(infl[dict['viseme_I']], eHint * 0.6, openVelocity);
        if (dict['viseme_U'] !== undefined) infl[dict['viseme_U']] = THREE.MathUtils.lerp(infl[dict['viseme_U']], uHint, openVelocity);
        // mouthFunnel/mouthStretch refuerzan la forma de los labios
        if (dict['mouthFunnel'] !== undefined) infl[dict['mouthFunnel']] = THREE.MathUtils.lerp(infl[dict['mouthFunnel']], uHint * 0.7, openVelocity);
        if (dict['mouthStretchLeft'] !== undefined) infl[dict['mouthStretchLeft']] = THREE.MathUtils.lerp(infl[dict['mouthStretchLeft']], eHint * 0.45, openVelocity);
        if (dict['mouthStretchRight'] !== undefined) infl[dict['mouthStretchRight']] = THREE.MathUtils.lerp(infl[dict['mouthStretchRight']], eHint * 0.45, openVelocity);
      });
    }

    // Capa de consonantes: ruido orgánico basado en senos superpuestos (~5-12 Hz)
    // Crea variación aleatoria de labios que simula oclusivas y fricativas
    if (morphDriven && baseVolume > 0.08) {
      const t = state.clock.elapsedTime;
      const n1 = Math.sin(t * 7.3);
      const n2 = Math.sin(t * 11.9);
      const n3 = Math.sin(t * 5.1);
      const ppHint = Math.max(0, n1) * Math.max(0, -n2) * open * 0.3;  // bilabial (p/b/m)
      const kkHint = Math.max(0, n2) * Math.max(0, n3) * open * 0.25; // velar (k/g)
      const ssHint = Math.max(0, -n3) * Math.max(0, n1) * open * 0.2;  // sibilante (s/z)
      meshesWithMorphs.forEach(mesh => {
        if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
        const infl = mesh.morphTargetInfluences;
        const dict = mesh.morphTargetDictionary;
        if (dict['viseme_PP'] !== undefined) infl[dict['viseme_PP']] = THREE.MathUtils.lerp(infl[dict['viseme_PP']], ppHint, openVelocity);
        if (dict['viseme_kk'] !== undefined) infl[dict['viseme_kk']] = THREE.MathUtils.lerp(infl[dict['viseme_kk']], kkHint, openVelocity);
        if (dict['viseme_SS'] !== undefined) infl[dict['viseme_SS']] = THREE.MathUtils.lerp(infl[dict['viseme_SS']], ssHint, openVelocity);
        if (dict['mouthPucker'] !== undefined) infl[dict['mouthPucker']] = THREE.MathUtils.lerp(infl[dict['mouthPucker']], ppHint * 0.4, openVelocity);
      });
    }

    // Estrategia 2: rotar jaw bone
    if (!morphDriven && jawRef.current) {
      jawRef.current.rotation.x = THREE.MathUtils.lerp(
        jawRef.current.rotation.x, open, openVelocity
      );
    }

    // ── Parpadeos automáticos aleatorios ──────────────────────────────────
    blinkTimer.current -= delta;
    if (blinkPhase.current === 'idle' && blinkTimer.current <= 0) {
      blinkPhase.current = 'closing';
      blinkTimer.current = 0.08;
    } else if (blinkPhase.current === 'closing') {
      blinkVal.current = 1 - Math.max(0, blinkTimer.current / 0.08);
      if (blinkTimer.current <= 0) { blinkPhase.current = 'paused'; blinkTimer.current = 0.06; blinkVal.current = 1; }
    } else if (blinkPhase.current === 'paused' && blinkTimer.current <= 0) {
      blinkPhase.current = 'opening';
      blinkTimer.current = 0.12;
    } else if (blinkPhase.current === 'opening') {
      blinkVal.current = Math.max(0, blinkTimer.current / 0.12);
      if (blinkTimer.current <= 0) { blinkPhase.current = 'idle'; blinkTimer.current = 2.5 + Math.random() * 3.5; blinkVal.current = 0; }
    }
    meshesWithMorphs.forEach(mesh => {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
      const lIdx = mesh.morphTargetDictionary['eyeBlinkLeft'];
      const rIdx = mesh.morphTargetDictionary['eyeBlinkRight'];
      if (lIdx !== undefined) mesh.morphTargetInfluences[lIdx] = blinkVal.current;
      if (rIdx !== undefined) mesh.morphTargetInfluences[rIdx] = blinkVal.current;
    });

    // ── Micro-movimiento idle de cabeza y respiración — solo sin animación embebida ──
    if (!mixerRef.current) {
      if (headRef.current) {
        const t = state.clock.elapsedTime;
        headRef.current.rotation.z = headRestZ.current + Math.sin(t * 0.4) * 0.006;
        headRef.current.rotation.y = headRestY.current + Math.sin(t * 0.25) * 0.004;
      }
      if (spineRef.current) {
        spineRef.current.rotation.x = spineRestX.current + Math.sin(state.clock.elapsedTime * 0.4) * 0.004;
      }
    }

    // ── Sonrisa base idle ─────────────────────────────────────────────────
    meshesWithMorphs.forEach(mesh => {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
      const d = mesh.morphTargetDictionary;
      const inf = mesh.morphTargetInfluences;
      if (d['mouthSmile'] !== undefined) inf[d['mouthSmile']] = 0.18;
      if (d['mouthSmileLeft'] !== undefined) inf[d['mouthSmileLeft']] = 0.18;
      if (d['mouthSmileRight'] !== undefined) inf[d['mouthSmileRight']] = 0.18;
    });

    // ── Cejas reactivas al volumen (sube cuando habla) ────────────────────
    const browTarget = baseVolume > 0.15 ? Math.min((baseVolume - 0.15) * 2.5, 0.4) : 0;
    browCurrent.current = THREE.MathUtils.lerp(browCurrent.current, browTarget, 0.08);
    meshesWithMorphs.forEach(mesh => {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;
      const d = mesh.morphTargetDictionary;
      const inf = mesh.morphTargetInfluences;
      if (d['browOuterUpLeft'] !== undefined) inf[d['browOuterUpLeft']] = browCurrent.current;
      if (d['browOuterUpRight'] !== undefined) inf[d['browOuterUpRight']] = browCurrent.current;
    });

    // Busto estático: se queda quieto y de frente a la pantalla (sin balanceo, inclinación ni latido). Solo se mueven la boca,
    // los ojos y las cejas; un busto que se mece parece flotar.
  });

  return <primitive object={clone} position={[0, encuadre?.y ?? -1.65, 0]} scale={encuadre?.escala ?? 1} rotation={[0, rotationY, 0]} />;
}

function Loader() {
  return (
    <>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color="#90C8E0" wireframe />
      </mesh>
      <Html center position={[0, -0.18, 0]}>
        <p style={{ color: '#94a3b8', fontSize: 13, margin: 0, whiteSpace: 'nowrap', fontFamily: 'system-ui, sans-serif' }}>
          Loading...
        </p>
      </Html>
    </>
  );
}

interface AvatarErrorState { error: Error | null }

class AvatarError extends React.Component<React.PropsWithChildren<object>, AvatarErrorState> {
  state: AvatarErrorState = { error: null };
  static getDerivedStateFromError(e: Error): AvatarErrorState { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          width: 260, height: 312, borderRadius: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 8, padding: 16, textAlign: 'center'
        }}>
          <span style={{ fontSize: 32 }}>🧑‍💻</span>
          <p style={{ fontSize: 12, color: '#2563EB', margin: 0 }}>
            No se pudo cargar el avatar 3D.<br />
            Verifica que el archivo .glb existe en public/models/
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface GlbAvatarProps {
  /** Ruta al archivo .glb dentro de /public, ej: '/models/avatar.glb' */
  glbPath: string;
  volume?: number;
  /** Ratio F2/(F1+F2): 0 = vocal redondeada, 1 = vocal spread */
  mouthShape?: number;
  /** Ancho del canvas en px (default 260) */
  width?: number;
  /** Alto del canvas en px (default 312) */
  height?: number;
  /** Corregir T-pose (brazos horizontales) — activar para modelos Avaturn exportados en T-pose */
  tPoseCorrection?: boolean;
  /** Rotación Y del modelo en radianes — para corregir orientación cuando la animación lo gira */
  rotationY?: number;
  /** Posición vertical y escala del modelo en cuadro (bustos estáticos). */
  encuadre?: { y?: number; escala?: number };
}

/**
 * GlbAvatar — renderiza cualquier archivo GLB humanoid con lip sync automático.
 * Soporta morph targets (ARKit/Oculus) y rotación de jaw bone como fallback.
 */
export default function GlbAvatar({ glbPath, volume = 0, mouthShape = 0, width = 260, height = 312, tPoseCorrection = false, rotationY = 0, encuadre }: GlbAvatarProps) {
  const volumeRef = useRef<number>(0);
  const shapeRef = useRef<number>(0);

  useEffect(() => {
    volumeRef.current = Math.min(Math.max(volume, 0), 1);
  }, [volume]);

  useEffect(() => {
    shapeRef.current = Math.min(Math.max(mouthShape, 0), 1);
  }, [mouthShape]);

  return (
    <AvatarError>
      <div style={{ width, height, display: 'inline-block', borderRadius: 2, overflow: 'hidden' }}>
        <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 0, 2.2], fov: 24 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}>
          <AmbienteEstudio />
          <ambientLight intensity={0.25} />
          <directionalLight position={[2.5, 3.5, 4]} intensity={1.0} color="#fff3e6" />
          <directionalLight position={[-3, 1.5, 2]} intensity={0.3} color="#bcd0ff" />
          <directionalLight position={[-1.5, 2.5, -3]} intensity={0.7} color="#ffffff" />
          <Suspense fallback={<Loader />}>
            <GLBScene glbPath={glbPath} volumeRef={volumeRef} shapeRef={shapeRef} tPoseCorrection={tPoseCorrection} rotationY={rotationY} encuadre={encuadre} />
          </Suspense>
        </Canvas>
      </div>
    </AvatarError>
  );
}
