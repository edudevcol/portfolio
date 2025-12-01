import React from 'react';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 bg-slate-900 relative overflow-hidden">
       <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Habilidades Técnicas</h2>
          <p className="text-slate-400">Stack tecnológico y herramientas que domino</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SKILLS.map((skill, index) => (
            <div 
              key={index} 
              className="group relative bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-slate-900 rounded-lg text-primary-400 group-hover:text-white group-hover:bg-primary-600 transition-colors duration-300 shadow-lg">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-200 group-hover:text-white">{skill.name}</h3>
                <span className="text-xs text-slate-500 uppercase tracking-wider mt-1">{skill.category}</span>
                
                {/* Level bar */}
                <div className="w-full bg-slate-700 h-1.5 mt-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-white" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;