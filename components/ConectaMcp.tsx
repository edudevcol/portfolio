import React, { useState } from 'react';
import { track } from '@vercel/analytics/react';
import { useLanguage } from '../contexts/LanguageContext';

const URL_MCP = 'https://api.edudev.biz/mcp';

const TEXTOS = {
  es: {
    titulo: 'Conecta mi perfil a tu agente',
    cuerpo: 'Mi perfil también está disponible como servidor MCP, de solo lectura: tu asistente de IA puede consultar mi experiencia, mis proyectos y mi disponibilidad, y evaluar mi encaje con una oferta. Abre los conectores de tu agente (por ejemplo, en Claude: Ajustes › Conectores › Agregar conector personalizado; en ChatGPT: Ajustes › Conectores), pega esta dirección y pregúntale por mí.',
    copiar: 'Copiar', copiado: 'Copiado', nota: 'Sin cuenta ni autenticación. Los pasos exactos cambian según el agente.',
  },
  en: {
    titulo: 'Connect my profile to your agent',
    cuerpo: 'My profile is also available as a read-only MCP server: your AI assistant can query my experience, my projects and my availability, and evaluate my fit for a job posting. Open your agent\'s connectors (for example, in Claude: Settings › Connectors › Add custom connector; in ChatGPT: Settings › Connectors), paste this address and ask it about me.',
    copiar: 'Copy', copiado: 'Copied', nota: 'No account or authentication needed. The exact steps vary by agent.',
  },
} as const;

/** Sección discreta con la URL del MCP del perfil, para quien quiera conectarlo a su propio agente. */
const ConectaMcp: React.FC = () => {
  const { language } = useLanguage();
  const T = TEXTOS[language];
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try { await navigator.clipboard.writeText(URL_MCP); } catch { /* sin permiso de portapapeles: la URL queda visible para copiarla a mano */ }
    setCopiado(true);
    track('mcp_url_copiada');
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <section id="mcp" className="py-14 border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">{T.titulo}</h2>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">{T.cuerpo}</p>
        <div className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 pl-4 pr-2 py-2">
          <code className="text-primary-300 text-sm md:text-base truncate select-all">{URL_MCP}</code>
          <button
            type="button"
            onClick={() => void copiar()}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copiado ? T.copiado : T.copiar}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">{T.nota}</p>
      </div>
    </section>
  );
};

export default ConectaMcp;
