import React from 'react';
import { EXPERIENCE } from '../constants';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 bg-slate-850">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Curriculum</h2>
        
        <div className="max-w-3xl mx-auto">
          {EXPERIENCE.map((item, index) => (
            <div key={item.id} className="relative pl-8 pb-12 last:pb-0 group">
              {/* Timeline Line */}
              {index !== EXPERIENCE.length - 1 && (
                <div className="absolute left-[11px] top-2 h-full w-0.5 bg-slate-700 group-hover:bg-slate-600 transition-colors"></div>
              )}
              
              {/* Dot */}
              <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-slate-800 border-4 border-slate-600 group-hover:border-primary-500 group-hover:bg-primary-900 transition-all z-10"></div>
              
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm group-hover:shadow-lg group-hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                  <h3 className="text-xl font-bold text-white">{item.role}</h3>
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-300 bg-primary-900/30 rounded-full mt-2 sm:mt-0">
                    {item.period}
                  </span>
                </div>
                <h4 className="text-primary-400 font-medium mb-3">{item.company}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;