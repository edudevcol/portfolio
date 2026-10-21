import React from 'react';
import type { Project } from '../types';

type Visual = NonNullable<Project['visual']>;

/**
 * Ilustraciones de los proyectos que no tienen una demo pública para capturar.
 * Son esquemas, no capturas: dibujan la idea de cada proyecto (qué entra, qué hace, qué sale).
 */
const Fondo: React.FC<{ id: string; from: string; to: string }> = ({ id, from, to }) => (
  <>
    <defs>
      <linearGradient id={`fondo-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
      <pattern id={`rejilla-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
      </pattern>
    </defs>
    <rect width="400" height="240" fill={`url(#fondo-${id})`} />
    <rect width="400" height="240" fill={`url(#rejilla-${id})`} />
  </>
);

const Tick: React.FC<{ x: number; y: number; ok?: boolean }> = ({ x, y, ok = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r="9" fill={ok ? '#10b981' : '#f59e0b'} fillOpacity="0.18" stroke={ok ? '#10b981' : '#f59e0b'} strokeOpacity="0.7" />
    {ok
      ? <path d="M-4 0l3 3 5-6" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      : <path d="M0 -4v5M0 4v.5" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />}
  </g>
);

/** Código entregado ⟷ criterios de aceptación → el agente marca qué está cubierto y qué no. */
const Criterios: React.FC = () => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="w-full h-full" role="img" aria-label="Código fuente contrastado con criterios de aceptación">
    <Fondo id="cr" from="#1e1b4b" to="#0f172a" />
    <rect x="24" y="34" width="150" height="172" rx="10" fill="#0b1020" stroke="#6366f1" strokeOpacity="0.5" />
    <text x="38" y="54" fontSize="10" fill="#818cf8" fontFamily="ui-monospace, monospace">código fuente</text>
    {[[38, 70, 70, '#818cf8'], [46, 86, 92, '#a78bfa'], [46, 102, 60, '#818cf8'], [38, 118, 84, '#6366f1'], [46, 134, 100, '#a78bfa'], [46, 150, 48, '#818cf8'], [38, 166, 76, '#6366f1'], [38, 182, 56, '#818cf8']].map(([x, y, w, c], i) => (
      <rect key={i} x={x as number} y={y as number} width={w as number} height="7" rx="3.5" fill={c as string} fillOpacity="0.75" />
    ))}
    <rect x="226" y="34" width="150" height="172" rx="10" fill="#0b1020" stroke="#10b981" strokeOpacity="0.45" />
    <text x="240" y="54" fontSize="10" fill="#34d399" fontFamily="ui-monospace, monospace">criterios de aceptación</text>
    {[['CA-01', true], ['CA-02', true], ['CA-03', false], ['CA-04', true]].map(([t, ok], i) => (
      <g key={i}>
        <Tick x={254} y={82 + i * 30} ok={ok as boolean} />
        <text x="272" y={86 + i * 30} fontSize="11" fill="#cbd5e1" fontFamily="ui-monospace, monospace">{t as string}</text>
        <rect x="316" y={79 + i * 30} width={ok ? 44 : 30} height="6" rx="3" fill={ok ? '#10b981' : '#f59e0b'} fillOpacity="0.55" />
      </g>
    ))}
    <g>
      <circle cx="200" cy="120" r="22" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
      <circle cx="200" cy="120" r="22" fill="none" stroke="#a78bfa" strokeOpacity="0.4" strokeWidth="6">
        <animate attributeName="r" values="22;30;22" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.4;0;0.4" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="198" cy="118" r="8" fill="none" stroke="#c4b5fd" strokeWidth="2.5" />
      <path d="M204 124l7 7" stroke="#c4b5fd" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    <path d="M174 120h4M222 120h4" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 4" />
  </svg>
);

/** El agente corre la batería de pruebas solo: una lista que avanza con su resultado. */
const Ejecutor: React.FC = () => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="w-full h-full" role="img" aria-label="Agente ejecutando pruebas de forma autónoma">
    <Fondo id="ej" from="#022c22" to="#0f172a" />
    <rect x="28" y="30" width="344" height="180" rx="12" fill="#07111d" stroke="#10b981" strokeOpacity="0.4" />
    <circle cx="46" cy="48" r="4" fill="#f87171" /><circle cx="60" cy="48" r="4" fill="#fbbf24" /><circle cx="74" cy="48" r="4" fill="#34d399" />
    <text x="96" y="52" fontSize="10" fill="#6ee7b7" fontFamily="ui-monospace, monospace">ejecución autónoma</text>
    {[
      ['login', 1, true], ['búsqueda', 1, true], ['carrito', 1, true], ['pago', 0.62, true], ['perfil', 0.18, true],
    ].map(([n, p, ok], i) => (
      <g key={i}>
        <text x="46" y={84 + i * 26} fontSize="11" fill="#cbd5e1" fontFamily="ui-monospace, monospace">{n as string}</text>
        <rect x="128" y={76 + i * 26} width="190" height="8" rx="4" fill="#0f2a22" />
        <rect x="128" y={76 + i * 26} width={190 * (p as number)} height="8" rx="4" fill="#10b981" fillOpacity={(p as number) === 1 ? 0.8 : 0.55}>
          {(p as number) < 1 && <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />}
        </rect>
        {(p as number) === 1 ? <Tick x={344} y={80 + i * 26} /> : (
          <circle cx="344" cy={80 + i * 26} r="6" fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="10 8">
            <animateTransform attributeName="transform" type="rotate" from={`0 344 ${80 + i * 26}`} to={`360 344 ${80 + i * 26}`} dur="1.1s" repeatCount="indefinite" />
          </circle>
        )}
      </g>
    ))}
  </svg>
);

/** Casos de prueba y bugs reportados en Jira: un tablero con tarjetas que avanzan de "bug" a "corregido". */
const Jira: React.FC = () => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="w-full h-full" role="img" aria-label="Casos de prueba y bugs reportados en Jira">
    <Fondo id="jr" from="#0b2a5b" to="#0f172a" />
    {[['CASOS', 22, '#60a5fa'], ['BUGS', 146, '#f87171'], ['CORREGIDO', 270, '#34d399']].map(([t, x, c], i) => (
      <g key={i} transform={`translate(${x} 30)`}>
        <rect width="108" height="180" rx="10" fill="#0b1426" stroke={c as string} strokeOpacity="0.35" />
        <text x="12" y="20" fontSize="9" fontWeight="700" letterSpacing="1.2" fill={c as string} fontFamily="ui-sans-serif, system-ui">{t as string}</text>
        {[0, 1, 2].slice(0, i === 1 ? 2 : 3).map((k) => (
          <g key={k} transform={`translate(10 ${34 + k * 46})`}>
            <rect width="88" height="38" rx="6" fill="#111c33" stroke="#ffffff" strokeOpacity="0.08" />
            <rect x="8" y="9" width={50 - k * 8} height="5" rx="2.5" fill="#cbd5e1" fillOpacity="0.7" />
            <rect x="8" y="20" width="32" height="4" rx="2" fill="#64748b" fillOpacity="0.6" />
            <rect x="8" y="28" width="22" height="4" rx="2" fill={c as string} fillOpacity="0.55" />
            <circle cx="76" cy="26" r="5" fill={c as string} fillOpacity="0.25" stroke={c as string} strokeOpacity="0.8" />
            {i === 1 && <path d="M73.5 23.5l5 5M78.5 23.5l-5 5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />}
            {i === 2 && <path d="M73.5 26l2 2 3.5-4" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        ))}
      </g>
    ))}
    <path d="M130 100h16M254 100h16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" />
    <circle r="4" fill="#fca5a5">
      <animateMotion dur="3s" repeatCount="indefinite" path="M130 100H146M254 100H270" />
    </circle>
  </svg>
);

/** El avatar conversacional: la cara en el centro y las herramientas y servidores MCP a los que está conectado. */
const AvatarMcp: React.FC = () => {
  const sat = [['Gmail', 62, 52], ['Calendar', 62, 120], ['Drive', 62, 188], ['Tareas', 338, 52], ['MCP', 338, 120], ['Teléfono', 338, 188]] as const;
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="w-full h-full" role="img" aria-label="Avatar conversacional conectado a múltiples servidores MCP">
      <Fondo id="av" from="#1e1b4b" to="#0c4a6e" />
      {sat.map(([t, x, y]) => (
        <path key={t} d={`M200 120C${(200 + x) / 2} 120 ${(200 + x) / 2} ${y} ${x} ${y}`} fill="none" stroke="#67e8f9" strokeOpacity="0.45" strokeWidth="1.6" strokeDasharray="3 4">
          <animate attributeName="stroke-dashoffset" values="14;0" dur="1.6s" repeatCount="indefinite" />
        </path>
      ))}
      <circle cx="200" cy="120" r="58" fill="#6366f1" fillOpacity="0.14">
        <animate attributeName="r" values="56;64;56" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="120" r="46" fill="#0b1020" stroke="#818cf8" strokeWidth="2" />
      <circle cx="200" cy="108" r="14" fill="#a5b4fc" fillOpacity="0.85" />
      <path d="M172 150c2-16 14-22 28-22s26 6 28 22" fill="#a5b4fc" fillOpacity="0.85" />
      <g transform="translate(200 172)" fill="#67e8f9">
        {[-18, -9, 0, 9, 18].map((dx, i) => (
          <rect key={dx} x={dx - 2} y="-8" width="4" height="16" rx="2" fillOpacity="0.85">
            <animate attributeName="height" values={`${6 + i * 2};18;${6 + i * 2}`} dur={`${0.9 + i * 0.12}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${-(3 + i)};-9;${-(3 + i)}`} dur={`${0.9 + i * 0.12}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      {sat.map(([t, x, y]) => (
        <g key={t} transform={`translate(${x - 34} ${y - 14})`}>
          <rect width="68" height="28" rx="14" fill="#0b1426" stroke="#67e8f9" strokeOpacity="0.55" />
          <text x="34" y="18" textAnchor="middle" fontSize="11" fill="#e0f2fe" fontFamily="ui-sans-serif, system-ui">{t}</text>
        </g>
      ))}
    </svg>
  );
};

/** Editor de nodos al estilo n8n: cada prueba es un nodo y se encadenan arrastrando. */
const Nodos: React.FC = () => (
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="w-full h-full" role="img" aria-label="Pruebas encadenadas arrastrando nodos">
    <Fondo id="nd" from="#082f49" to="#0f172a" />
    <defs>
      <linearGradient id="nodo-borde" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#818cf8" /></linearGradient>
    </defs>
    <path d="M118 120C146 120 146 70 174 70M118 120C146 120 146 170 174 170M246 70C274 70 274 120 300 120M246 170C274 170 274 120 300 120" fill="none" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="2.5" />
    {[['Login', 22, 96, '▶'], ['Carrito', 174, 46, '◆'], ['Búsqueda', 174, 146, '◆'], ['Verificar', 300, 96, '✓']].map(([t, x, y, ic], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <rect width="96" height="48" rx="10" fill="#0b1426" stroke="url(#nodo-borde)" strokeWidth="1.6" />
        <rect x="8" y="12" width="24" height="24" rx="7" fill="#38bdf8" fillOpacity="0.15" />
        <text x="20" y="29" textAnchor="middle" fontSize="12" fill="#7dd3fc">{ic as string}</text>
        <text x="40" y="29" fontSize="11" fill="#e2e8f0" fontFamily="ui-sans-serif, system-ui">{t as string}</text>
        <circle cx="0" cy="24" r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
        <circle cx="96" cy="24" r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      </g>
    ))}
    <circle r="4" fill="#bae6fd">
      <animateMotion dur="3.2s" repeatCount="indefinite" path="M118 120C146 120 146 70 174 70M246 70C274 70 274 120 300 120" />
    </circle>
    <g transform="translate(330 196)">
      <path d="M0 0l0 18 5-4 3 8 4-2-3-8 7-1z" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
    </g>
  </svg>
);

const VISUALES: Record<Visual, React.FC> = { criterios: Criterios, ejecutor: Ejecutor, jira: Jira, nodos: Nodos, avatar: AvatarMcp };

interface Props { project: Pick<Project, 'title' | 'image' | 'visual'>; className?: string; }

/** Muestra la ilustración propia del proyecto o, si no la tiene, su captura. */
const ProjectVisual: React.FC<Props> = ({ project, className = '' }) => {
  if (project.visual) {
    const V = VISUALES[project.visual];
    return <div className={`w-full h-full ${className}`}><V /></div>;
  }
  return <img src={project.image} alt={`Captura del proyecto ${project.title}`} loading="lazy" decoding="async" className={`w-full h-full object-cover ${className}`} />;
};

export default ProjectVisual;
