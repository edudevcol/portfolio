import React from 'react';
import type { Project } from '../types';
import ProjectVisual from './ProjectVisual';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  /** Los tres agentes, en el orden del flujo: verifica → ejecuta → reporta. */
  agentes: Project[];
  onOpen: (p: Project) => void;
}

const Flecha: React.FC = () => (
  <div className="flex items-center justify-center lg:px-1 py-1 lg:py-0" aria-hidden="true">
    <svg viewBox="0 0 48 24" className="w-10 h-6 rotate-90 lg:rotate-0 text-primary-400">
      <path d="M2 12h38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 5">
        <animate attributeName="stroke-dashoffset" values="16;0" dur="1.2s" repeatCount="indefinite" />
      </path>
      <path d="M36 5l9 7-9 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

/**
 * El hilo que une los tres agentes de QA: lo desarrollado se verifica, se ejecutan las pruebas y se
 * reporta en Jira. Cada tarjeta abre el detalle del proyecto.
 */
const AgenticPipeline: React.FC<Props> = ({ agentes, onOpen }) => {
  const { t } = useLanguage();
  const tr = t('portfolio');
  if (agentes.length === 0) return null;

  return (
    <div className="mb-16 rounded-3xl border border-primary-500/20 bg-gradient-to-br from-slate-800/70 via-slate-900 to-slate-900 p-6 md:p-10 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary-400 mb-3">{tr.pipelineEyebrow}</span>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 max-w-3xl">{tr.pipelineTitle}</h3>
        <p className="text-slate-400 max-w-3xl mb-8 leading-relaxed">{tr.pipelineSubtitle}</p>

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-0">
          {agentes.map((a, i) => (
            <React.Fragment key={a.id}>
              {i > 0 && <Flecha />}
              <button
                type="button"
                onClick={() => onOpen(a)}
                className="group flex-1 min-w-0 text-left rounded-2xl bg-slate-900/80 border border-slate-700 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden"
              >
                <div className="h-36 overflow-hidden relative">
                  <ProjectVisual project={a} className="transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700 text-xs font-semibold text-slate-200 backdrop-blur-sm">
                    <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-[11px] flex items-center justify-center">{i + 1}</span>
                    {tr.pipelineSteps?.[i]}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{a.title}</h4>
                  <p className="text-sm text-slate-400 line-clamp-3">{a.shortDescription}</p>
                </div>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgenticPipeline;
