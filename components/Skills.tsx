import React from 'react';
import { SKILLS } from '../constants';
import { L } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Habilidades con la IA agéntica al frente. El grupo "Agentic AI" lleva, por cada habilidad, qué hago con ella
 * (cada una la respalda un proyecto de abajo); el resto va como etiquetas agrupadas, sin barras de nivel.
 */
const GRUPOS_SECUNDARIOS: Array<{ clave: 'Testing' | 'Desarrollo' | 'Herramientas'; acento: string; punto: string }> = [
  { clave: 'Testing', acento: 'border-emerald-500/30 hover:border-emerald-400/60', punto: 'bg-emerald-400' },
  { clave: 'Desarrollo', acento: 'border-sky-500/30 hover:border-sky-400/60', punto: 'bg-sky-400' },
  { clave: 'Herramientas', acento: 'border-slate-600 hover:border-slate-400', punto: 'bg-slate-400' },
];

const Skills: React.FC = () => {
  const { t, language } = useLanguage();
  const tr = t('skills');
  const agenticas = SKILLS.filter(s => s.category === 'Agentic AI');

  return (
    <section id="skills" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{tr.title}</h2>
          <p className="text-slate-400">{tr.subtitle}</p>
        </div>

        {/* Agentic AI: el grupo destacado */}
        <div className="relative rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-900 p-6 md:p-8 mb-8 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-violet-300 mb-2">{tr.agenticEyebrow}</span>
            <h3 className="text-2xl font-bold text-white mb-1">{tr.agenticTitle}</h3>
            <p className="text-slate-400 mb-6 max-w-2xl">{tr.agenticSubtitle}</p>

            {/* En celular, un carrusel que se desliza de lado (cinco tarjetas apiladas eran tres pantallas de scroll); desde md, la cuadrícula */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* 5 tarjetas: tres arriba y dos abajo repartiéndose el ancho, sin hueco */}
              {agenticas.map((skill, i) => (
                <div key={i} className={`${i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'} group shrink-0 w-[82%] sm:w-[60%] md:w-auto snap-start rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-violet-400/60 p-5 transition-all duration-300 hover:-translate-y-1`}>
                  <div className="mb-3 inline-flex p-2.5 rounded-lg bg-violet-500/10 text-violet-300 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    {skill.icon}
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1">{L(skill.name, language)}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{skill.description ? L(skill.description, language) : null}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* El resto, agrupado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GRUPOS_SECUNDARIOS.map(({ clave, acento, punto }) => (
            <div key={clave} className={`rounded-2xl bg-slate-800/40 border p-6 transition-colors ${acento}`}>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                <span className={`w-2 h-2 rounded-full ${punto}`} />
                {tr.groups[clave]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {SKILLS.filter(s => s.category === clave).map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200">
                    {L(skill.name, language)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
