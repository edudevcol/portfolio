import React from 'react';
import { EXPERIENCE } from '../constants';
import { L } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Check: React.FC = () => (
  <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
  </svg>
);

const Experience: React.FC = () => {
  const { t, language } = useLanguage();
  const tr = t('experience');

  return (
    <section id="experience" className="py-20 bg-slate-850">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{tr.title}</h2>
          <p className="text-slate-400">{tr.subtitle}</p>
        </div>

        {/* Foco actual: hacia dónde va el trabajo, con salto a los agentes */}
        <a
          href="#portfolio"
          className="group flex items-center gap-4 mb-8 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/50 to-slate-900 px-6 py-5 hover:border-violet-400/60 transition-colors"
        >
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-60 animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-400" />
          </span>
          <div className="min-w-0">
            <span className="block text-xs font-bold tracking-[0.18em] uppercase text-violet-300">{tr.focusLabel}</span>
            <span className="block text-sm md:text-base text-slate-300">{tr.focusText}</span>
          </div>
          <span className="ml-auto text-violet-300 group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
        </a>

        {/* Ocupa el ancho como el resto de secciones: el cargo actual, más grande, y el anterior al lado */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {EXPERIENCE.map((item) => (
            <div
              key={item.id}
              className={`${item.current ? 'lg:col-span-3 border-primary-500/30' : 'lg:col-span-2 border-slate-800'} bg-slate-900 p-6 md:p-8 rounded-2xl border hover:border-slate-600 hover:shadow-xl transition-all flex flex-col`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {item.current && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {tr.current}
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold text-primary-300 bg-primary-900/30 rounded-full">{L(item.period, language)}</span>
              </div>
              <h3 className={`${item.current ? 'text-2xl' : 'text-xl'} font-bold text-white`}>{L(item.role, language)}</h3>
              <h4 className="text-primary-400 font-medium mt-1 mb-5">{item.company}</h4>

              <ul className="space-y-3 mb-6">
                {item.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2.5 text-sm md:text-[15px] text-slate-300 leading-relaxed">
                    <Check />
                    <span>{L(h, language)}</span>
                  </li>
                ))}
              </ul>

              {item.agentic && (
                <div className="mb-6 rounded-xl border border-violet-500/25 bg-violet-950/20 p-4">
                  <span className="block text-xs font-bold tracking-[0.18em] uppercase text-violet-300 mb-3">{tr.agenticLabel}</span>
                  <ul className="space-y-2.5">
                    {item.agentic.map((h, i) => (
                      <li key={i} className="flex gap-2.5 text-sm md:text-[15px] text-slate-200 leading-relaxed">
                        <svg className="w-4 h-4 mt-0.5 shrink-0 text-violet-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2l1.8 4.9L17 8.7l-4.2 3.2L14 17l-4-2.8L6 17l1.2-5.1L3 8.7l5.2-1.8L10 2z" /></svg>
                        <span>{L(h, language)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-auto">
                {item.tags.map((tag, ti) => (
                  <span key={ti} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">{L(tag, language)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
