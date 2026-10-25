// Genera el CV "limpio" para sistemas de selección (ATS): una sola columna, texto real, títulos estándar, sin iconos,
// tablas ni columnas, con los datos de contacto en el cuerpo. Sale de public/perfil.json, igual que cv.md.
// Uso: node scripts/generar-pdf.mjs          (necesita Playwright con Chrome; si no está en este proyecto,
//      PLAYWRIGHT_PATH=/ruta/a/node_modules/playwright node scripts/generar-pdf.mjs)
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const P = JSON.parse(readFileSync('public/perfil.json', 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (o, l) => (o && typeof o === 'object' && !Array.isArray(o) ? o[l] ?? o.es : o);
const tel = '+57 ' + P.contacto.whatsapp.replace('+57', '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');

const ETIQUETAS = {
  es: { resumen: 'Resumen profesional', exp: 'Experiencia laboral', hab: 'Habilidades', proy: 'Proyectos', form: 'Formación', idi: 'Idiomas', disp: 'Disponibilidad y objetivos', agentic: 'Agentic QA', plat: 'Automatización y plataformas', interno: 'Cargo interno', equiv: 'equivalente a Senior QA Automation Engineer', demo: 'Demo', ubic: 'Ubicación' },
  en: { resumen: 'Professional Summary', exp: 'Work Experience', hab: 'Skills', proy: 'Projects', form: 'Education', idi: 'Languages', disp: 'Availability and goals', agentic: 'Agentic QA', plat: 'Automation and platforms', interno: 'Internal title', equiv: 'equivalent to Senior QA Automation Engineer', demo: 'Demo', ubic: 'Location' },
};

function html(l) {
  const E = ETIQUETAS[l];
  const b = P.busca;
  const lista = (xs) => `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  return `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><title>${esc(P.nombreCompleto)} - CV</title>
<style>
  @page { size: A4; margin: 16mm 17mm; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.38; color: #111; }
  h1 { font-size: 20pt; margin: 0 0 2pt; }
  h2 { font-size: 12pt; margin: 13pt 0 4pt; padding-bottom: 2pt; border-bottom: 1px solid #444; text-transform: uppercase; letter-spacing: .4pt; }
  h3 { font-size: 11pt; margin: 8pt 0 1pt; }
  p { margin: 2pt 0; } ul { margin: 2pt 0 4pt 16pt; padding: 0; } li { margin: 1.5pt 0; }
  .sub { font-weight: bold; margin-bottom: 4pt; } .meta { color: #333; }
</style></head><body>
<h1>${esc(P.nombreCompleto)}</h1>
<p class="sub">${esc(t(P.titulo, l))}</p>
<p class="meta">${esc(P.ubicacion.ciudad)}, ${esc(P.ubicacion.pais)} | ${esc(P.contacto.email)} | ${esc(tel)}</p>
<p class="meta">LinkedIn: ${esc(P.contacto.linkedin.replace('https://www.', ''))} | GitHub: ${esc(P.contacto.github.replace('https://', ''))} | ${esc(P.contacto.portafolio.replace('https://', ''))}</p>
<p class="meta">${l === 'es' ? 'Clon digital (avatar con IA)' : 'Digital clone (AI avatar)'}: ${esc(P.contacto.clonDigital.replace('https://', ''))} | ${l === 'es' ? 'Mi perfil como servidor MCP (para agentes de IA)' : 'My profile as an MCP server (for AI agents)'}: ${esc(P.contacto.mcp.replace('https://', ''))}</p>

<h2>${E.resumen}</h2>
<p>${esc(t(P.posicionamiento, l))}</p>
<p>${esc(t(P.resumen, l))}</p>

<h2>${E.hab}</h2>
${P.habilidades.map((g) => `<p><strong>${esc(t(g.nombre, l))}:</strong> ${esc((l === 'en' && g.itemsEn ? g.itemsEn : g.items).join(', '))}.</p>`).join('')}

<h2>${E.exp}</h2>
${P.experiencia.map((e) => `<h3>${esc(t(e.cargo, l))} | ${esc(e.empresa)} | ${esc(t(e.periodo, l))}</h3>
${e.cargoInterno ? `<p>${E.interno}: ${esc(t(e.cargoInterno, l))} (${E.equiv}).</p>` : ''}
${e.agentic ? `<p><strong>${E.agentic}</strong></p>${lista(e.agentic.map((a) => t(a, l)))}<p><strong>${E.plat}</strong></p>` : ''}
${lista(e.logros.map((g) => t(g, l)))}`).join('')}

<h2>${E.proy}</h2>
${lista(P.proyectos.map((p) => `${t(p.nombre, l)}: ${t(p.resumen, l)}${p.demo ? ` ${E.demo}: ${p.demo}` : ''}`))}

<h2>${E.form}</h2>
${lista(P.formacion.map((f) => `${t(f.titulo, l)} - ${f.institucion} (${f.fecha})`))}

<h2>${E.idi}</h2>
${lista(P.idiomas.map((i) => `${t(i.idioma, l)}: ${t(i.nivel, l)}`))}

<h2>${E.disp}</h2>
<p>${esc(t(b.disponibilidad, l))}. ${esc(t(b.modalidad, l))}. ${esc(t(b.permisoDeTrabajo, l))}</p>
<p>${l === 'es' ? 'Roles de interés' : 'Target roles'}: ${esc(t(b.rolesObjetivo, l).join(', '))}.</p>
</body></html>`;
}

const navegador = await chromium.launch({ channel: 'chrome', headless: true });
for (const l of ['es', 'en']) {
  const pagina = await navegador.newPage();
  await pagina.setContent(html(l), { waitUntil: 'load' });
  await pagina.pdf({ path: `public/Eduardo_Navarro_CV_${l.toUpperCase()}.pdf`, format: 'A4', printBackground: false, displayHeaderFooter: false, preferCSSPageSize: true });
  await pagina.close();
  console.log(`Generado public/Eduardo_Navarro_CV_${l.toUpperCase()}.pdf`);
}
await navegador.close();
