// Genera, desde public/perfil.json (fuente única), todo lo que lee una máquina:
//   public/cv.md, public/cv.en.md  (formato "Career Context": H1, QUICK REFERENCE en YAML, hechos verificados)
//   public/llms.txt
//   index.html: el bloque estático (para quien no ejecuta JavaScript) y los datos estructurados JSON-LD
// Uso: node scripts/generar-perfil.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const P = JSON.parse(readFileSync('public/perfil.json', 'utf8'));
const URL = P.contacto.portafolio + '/';
const L = { es: 'es', en: 'en' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const t = (o, l) => (o && typeof o === 'object' ? o[l] ?? o.es : o);
const tel = P.contacto.whatsapp.replace(/^\+57/, '+57 ').replace(/(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');

// ---------- Career Context (Markdown) ----------
function cvMarkdown(l) {
  const es = l === 'es';
  const yamlList = (xs) => '[' + xs.join(', ') + ']';
  const topSkills = P.habilidades.find((g) => g.id === 'agentic').items.concat(P.habilidades.find((g) => g.id === 'testing').items.slice(0, 5));
  const tools = P.habilidades.find((g) => g.id === 'herramientas').items.concat(['Playwright', 'Postman']);
  const out = [];
  out.push(`# ${P.nombreCompleto} - ${t(P.titulo, l)}`, '');
  out.push('## QUICK REFERENCE', '', '```yaml');
  out.push(`name: ${P.nombreCompleto}`);
  out.push(`also_known_as: ${P.nombre}`);
  out.push(`current_location: ${P.ubicacion.ciudad}, ${P.ubicacion.pais}`);
  out.push(`positioning_summary: "${t(P.posicionamiento, l)}"`);
  out.push(`current_focus: "${t(P.enfoqueActual, l)}"`);
  out.push('professional:');
  for (const e of P.experiencia) out.push(`  - "[ROLE] ${t(e.cargo, l)}${e.cargoInterno ? ` (${es ? 'cargo interno' : 'internal title'}: ${t(e.cargoInterno, l)})` : ''} | ${e.empresa} | ${t(e.periodo, l)}"`);
  out.push(`top_skills: ${yamlList(topSkills)}`);
  out.push(`tools: ${yamlList([...new Set(tools)])}`);
  out.push('education:');
  for (const f of P.formacion) out.push(`  - "[DEGREE] ${t(f.titulo, l)} | ${f.institucion} | ${f.fecha}"`);
  out.push('languages:');
  for (const i of P.idiomas) out.push(`  - "${t(i.idioma, l)}: ${t(i.nivel, l)}"`);
  out.push(`target_roles: ${yamlList(t(P.busca.rolesObjetivo, l))}`, `work_authorization: "${t(P.busca.permisoDeTrabajo, l)}"`);
  out.push(`open_to_relocation: ${P.busca.reubicacion}`, `target_locations: ${yamlList(t(P.busca.destinosPreferidos, l))}`, `work_mode: "${t(P.busca.modalidad, l)}"`, `availability: "${t(P.busca.disponibilidad, l)}"`);
  out.push(`mcp_server: ${P.contacto.mcp}`, `email: ${P.contacto.email}`, `github: ${P.contacto.github}`, `linkedin: ${P.contacto.linkedin}`, `portfolio: ${P.contacto.portafolio}`, `digital_clone: ${P.contacto.clonDigital}`);
  out.push('```', '');
  out.push(es
    ? `Este archivo es la hoja de vida de ${P.nombre} en texto plano, para lectura automática. No reemplaza al PDF ni a LinkedIn: es la misma información, con formato estable. Los datos que no deben suponerse están en el comentario de abajo.`
    : `This file is ${P.nombre}'s resume in plain text, for automated reading. It does not replace the PDF or LinkedIn: it is the same information in a stable format. Facts that must not be guessed are in the comment below.`);
  out.push('', '<!-- VERIFIED FACTS: current_employer=Sociedad Portuaria Regional de Cartagena; since=2020-08; previous_employer=Calzado Latino; previous_period=2017-06..2019-07; degree=Systems Engineering, Universidad de Cartagena, 2016-12; bootcamp=Coderhouse Full Stack Web, 2024-01; english_level=A2 -->', '');
  out.push('## Goals and targeting', '');
  out.push(es
    ? `Busca principalmente empresas que ofrezcan reubicación en ${t(P.busca.destinosPreferidos, l).join(' o ')}. ${t(P.busca.modalidad, l)}. Disponibilidad: ${t(P.busca.disponibilidad, l).toLowerCase()}. ${t(P.busca.permisoDeTrabajo, l)} ${t(P.busca.tambienAbiertoA, l)} Roles: ${t(P.busca.rolesObjetivo, l).join(', ')}.`
    : `Mainly looking for companies that offer relocation to ${t(P.busca.destinosPreferidos, l).join(' or ')}. ${t(P.busca.modalidad, l)}. Availability: ${t(P.busca.disponibilidad, l).toLowerCase()}. ${t(P.busca.permisoDeTrabajo, l)} ${t(P.busca.tambienAbiertoA, l)} Roles: ${t(P.busca.rolesObjetivo, l).join(', ')}.`);
  out.push('');
  out.push(es ? '## Resumen' : '## Summary', '', t(P.resumen, l), '');
  out.push(es ? '## Experiencia' : '## Experience', '');
  for (const e of P.experiencia) {
    out.push(`### ${t(e.cargo, l)} — ${e.empresa} (${t(e.periodo, l)})`, '');
    if (e.cargoInterno) { out.push(es ? `Cargo interno: ${t(e.cargoInterno, l)} (equivalente a Senior QA Automation Engineer).` : `Internal title: ${t(e.cargoInterno, l)} (equivalent to Senior QA Automation Engineer).`, ''); }
    if (e.agentic) { out.push(es ? '**Agentic QA**' : '**Agentic QA**', ''); for (const a of e.agentic) out.push('- ' + t(a, l)); out.push(''); out.push(es ? '**Automatización y plataformas**' : '**Automation and platforms**', ''); }
    for (const g of e.logros) out.push('- ' + t(g, l));
    out.push('');
  }
  out.push(es ? '## Habilidades' : '## Skills', '');
  for (const g of P.habilidades) out.push(`- **${t(g.nombre, l)}:** ${g.items.join(', ')}`);
  out.push('');
  out.push(es ? '## Proyectos' : '## Projects', '');
  for (const p of P.proyectos) {
    let s = `- **${t(p.nombre, l)}** — ${t(p.resumen, l)}`;
    if (p.empresa) s += es ? ` Hecho para la ${p.empresa}.` : ` Built for ${p.empresa}.`;
    if (p.stack) s += (es ? ' Stack: ' : ' Stack: ') + p.stack.join(', ') + '.';
    if (p.demo) s += ` Demo: ${p.demo}`;
    if (p.repo) s += ` · Repo: ${p.repo}`;
    out.push(s);
  }
  out.push('');
  if (P.impacto) {
    out.push(es ? '## Cómo trabajan los agentes e impacto estimado' : '## How the agents work and estimated impact', '');
    out.push(t(P.impacto.aviso, l), '');
    for (const c of P.impacto.comoTrabajan) out.push('- ' + t(c, l));
    out.push('');
    for (const e of P.impacto.estimaciones) {
      out.push(`**${t(e.titulo, l)}** (${es ? 'supuesto' : 'assumption'}: ${t(e.supuesto, l)})`, '');
      for (const x of e.lineas) out.push('- ' + t(x, l));
      out.push('');
    }
    out.push(`| ${es ? 'Indicador' : 'Indicator'} | ${es ? 'Estimación' : 'Estimate'} |`, '|---|---|');
    for (const r of P.impacto.resumen) out.push(`| ${t(r.indicador, l)} | ${r.mejora} |`);
    out.push('');
  }
  out.push(es ? '## Formación' : '## Education', '');
  for (const f of P.formacion) out.push(`- ${t(f.titulo, l)} — ${f.institucion} (${f.fecha})`);
  out.push('', es ? '## Idiomas' : '## Languages', '');
  for (const i of P.idiomas) out.push(`- ${t(i.idioma, l)}: ${t(i.nivel, l)}`);
  out.push('');
  return out.join('\n');
}
writeFileSync('public/cv.md', cvMarkdown('es'));
writeFileSync('public/cv.en.md', cvMarkdown('en'));

// ---------- llms.txt ----------
const llms = `# ${P.nombre}

> ${t(P.posicionamiento, 'es')} / ${t(P.posicionamiento, 'en')}

Contacto / Contact: ${P.contacto.email} · ${P.contacto.linkedin} · ${P.contacto.github}

## Perfil completo / Full profile

- [Datos estructurados (JSON)](${URL}perfil.json): toda la información verificada en un solo archivo.
- [CV en texto plano (Markdown, español)](${URL}cv.md)
- [CV in plain text (Markdown, English)](${URL}cv.en.md)
- [CV en PDF, versión limpia de una columna (español)](${P.contacto.cvPdfLimpioEs})
- [Clean one-column PDF resume (English)](${P.contacto.cvPdfLimpioEn})
- [CV en PDF, versión diseñada](${P.contacto.cvPdf})
- [Portafolio interactivo](${URL})
- Servidor MCP del perfil (solo lectura, para agentes): ${P.contacto.mcp} — tools: get_profile, get_experience, get_skills, list_projects, get_education, evaluate_job_fit, get_contact, ask_the_clone.

## Proyectos / Projects

- [Clon digital: avatar conversacional con IA](${P.contacto.clonDigital}): se puede conversar con él en vivo.
${P.proyectos.filter((p) => p.demo && p.id !== 'avatar-conversacional').map((p) => `- [${t(p.nombre, 'en')}](${p.demo})`).join('\n')}
- Código / Code: ${P.contacto.github}
`;
writeFileSync('public/llms.txt', llms);

// ---------- index.html: JSON-LD + bloque estático ----------
const persona = {
  '@type': 'Person', '@id': URL + '#eduardo', name: P.nombre, alternateName: P.nombreCompleto, url: URL,
  image: URL + 'og-image.jpg', jobTitle: t(P.experiencia[0].cargo, 'en'), description: t(P.posicionamiento, 'es'),
  email: 'mailto:' + P.contacto.email,
  address: { '@type': 'PostalAddress', addressLocality: P.ubicacion.ciudad, addressCountry: P.ubicacion.codigoPais },
  worksFor: { '@type': 'Organization', name: P.experiencia[0].empresa },
  alumniOf: [{ '@type': 'CollegeOrUniversity', name: 'Universidad de Cartagena' }, { '@type': 'EducationalOrganization', name: 'Coderhouse' }],
  hasOccupation: { '@type': 'Occupation', name: 'Agentic QA Engineer', occupationLocation: { '@type': 'City', name: `${P.ubicacion.ciudad}, ${P.ubicacion.pais}` } },
  knowsAbout: [...new Set(P.habilidades.flatMap((g) => g.items))],
  sameAs: [P.contacto.github, P.contacto.linkedin],
};
const grafo = {
  '@context': 'https://schema.org',
  '@graph': [
    persona,
    { '@type': 'WebAPI', '@id': URL + '#mcp', name: `${P.nombre} · MCP server (profile, read-only)`, url: P.contacto.mcp, documentation: URL + '#mcp', description: 'Model Context Protocol server exposing the professional profile: experience, skills, projects, education, availability and job-fit evaluation.', provider: { '@id': URL + '#eduardo' } },
    { '@type': 'WebSite', '@id': URL + '#sitio', url: URL, name: `${P.nombre} · Portafolio`, inLanguage: 'es', author: { '@id': URL + '#eduardo' } },
    ...P.proyectos.map((p) => ({
      '@type': 'CreativeWork', name: t(p.nombre, 'es'), description: t(p.resumen, 'es'),
      author: { '@id': URL + '#eduardo' }, keywords: (p.stack || []).join(', '),
      ...(p.demo ? { url: p.demo } : {}), ...(p.repo ? { codeRepository: p.repo } : {}),
    })),
  ],
};

const li = (s) => `          <li>${s}</li>`;
const bloque = `      <main style="max-width:48rem;margin:0 auto;padding:2rem 1.5rem;font-family:system-ui,sans-serif;line-height:1.6;color:#e2e8f0">
        <h1>${esc(P.nombreCompleto)}</h1>
        <p><strong>${esc(t(P.titulo, 'es'))}</strong> — ${esc(P.ubicacion.ciudad)}, ${esc(P.ubicacion.pais)}</p>
        <p>${esc(t(P.posicionamiento, 'es'))}</p>
        <p>Disponibilidad ${esc(t(P.busca.disponibilidad, 'es').toLowerCase())}. Abierto a reubicación (${esc(t(P.busca.destinosPreferidos, 'es').join(', '))}). ${esc(t(P.busca.modalidad, 'es'))}. ${esc(t(P.busca.permisoDeTrabajo, 'es'))} Roles de interés: ${esc(t(P.busca.rolesObjetivo, 'es').join(', '))}.</p>
        <p lang="en">${esc(t(P.posicionamiento, 'en'))} ${esc(t(P.resumen, 'en'))}</p>

        <h2>Contacto</h2>
        <ul>
${li(`Correo: <a href="mailto:${P.contacto.email}">${P.contacto.email}</a>`)}
${li(`LinkedIn: <a href="${P.contacto.linkedin}">${P.contacto.linkedin.replace('https://www.', '')}</a>`)}
${li(`GitHub: <a href="${P.contacto.github}">${P.contacto.github.replace('https://', '')}</a>`)}
${li(`WhatsApp: <a href="https://wa.me/${P.contacto.whatsapp}">${tel}</a>`)}
${li(`Clon digital (avatar con IA, conversa en voz): <a href="${P.contacto.clonDigital}">${P.contacto.clonDigital.replace('https://', '')}</a>`)}
${li(`Hoja de vida: <a href="/Eduardo_Navarro_CV_ES.pdf">PDF (es)</a> · <a href="/Eduardo_Navarro_CV_EN.pdf">PDF (en)</a> · <a href="/EDUARDONAVARRO2025_CV.pdf">PDF diseñado</a> · <a href="/cv.md">texto (es)</a> · <a href="/cv.en.md">text (en)</a> · <a href="/perfil.json">JSON</a>`)}
        </ul>

        <h2 id="mcp">Conecta mi perfil a tu agente (MCP) / Connect my profile to your agent (MCP)</h2>
        <p>Mi perfil está disponible como servidor MCP de solo lectura, sin autenticación: <a href="${P.contacto.mcp}">${P.contacto.mcp}</a>. En los conectores de tu agente, agrega un conector personalizado con esa dirección. Herramientas: get_profile, get_experience, get_skills, list_projects, get_education, evaluate_job_fit, get_contact, ask_the_clone.</p>
        <p lang="en">My profile is available as a read-only MCP server, no authentication: <a href="${P.contacto.mcp}">${P.contacto.mcp}</a>. Add it as a custom connector in your agent's connectors.</p>

        <h2>Resumen profesional</h2>
        <p>${esc(t(P.resumen, 'es'))}</p>

        <h2>Experiencia</h2>
${P.experiencia.map((e) => `        <h3>${esc(t(e.cargo, 'es'))} — ${esc(e.empresa)} (${esc(t(e.periodo, 'es'))})</h3>
${e.cargoInterno ? `        <p>Cargo interno: ${esc(t(e.cargoInterno, 'es'))} (equivalente a Senior QA Automation Engineer).</p>\n` : ''}
${e.agentic ? `        <p><strong>Agentic QA:</strong></p>\n        <ul>\n${e.agentic.map((a) => li(esc(t(a, 'es')))).join('\n')}\n        </ul>\n        <p><strong>Automatización y plataformas:</strong></p>\n` : ''}        <ul>
${e.logros.map((g) => li(esc(t(g, 'es')))).join('\n')}
        </ul>`).join('\n')}

        <h2>Habilidades</h2>
        <p>${P.habilidades.map((g) => `<strong>${esc(t(g.nombre, 'es'))}:</strong> ${esc(g.items.join(', '))}.`).join('<br />\n        ')}</p>

        <h2>Proyectos</h2>
        <ul>
${P.proyectos.map((p) => li(`<strong>${esc(t(p.nombre, 'es'))}</strong>: ${esc(t(p.resumen, 'es'))}${p.empresa ? ' Hecho para la ' + esc(p.empresa) + '.' : ''}${p.demo ? ` <a href="${p.demo}">Demo</a>` : ''}${p.repo ? ` · <a href="${p.repo}">repositorio</a>` : ''}`)).join('\n')}
        </ul>

        <h2>Formación</h2>
        <ul>
${P.formacion.map((f) => li(`${esc(t(f.titulo, 'es'))} — ${esc(f.institucion)} (${esc(f.fecha)})`)).join('\n')}
        </ul>

        <h2>Idiomas</h2>
        <ul>
${P.idiomas.map((i) => li(`${esc(t(i.idioma, 'es'))}: ${esc(t(i.nivel, 'es'))}`)).join('\n')}
        </ul>
        <noscript><p>Esta página usa JavaScript para mostrar el portafolio interactivo y el avatar con IA.</p></noscript>
      </main>`;

let html = readFileSync('index.html', 'utf8');
const reemplazar = (ini, fin, contenido) => {
  const a = html.indexOf(ini), b = html.indexOf(fin);
  if (a < 0 || b < 0) throw new Error(`Faltan los marcadores ${ini} / ${fin} en index.html`);
  html = html.slice(0, a + ini.length) + '\n' + contenido + '\n' + html.slice(b);
};
reemplazar('<!-- PERFIL:JSONLD:INICIO -->', '<!-- PERFIL:JSONLD:FIN -->', `    <script type="application/ld+json">\n${JSON.stringify(grafo, null, 2)}\n    </script>`);
reemplazar('<!-- PERFIL:ESTATICO:INICIO -->', '<!-- PERFIL:ESTATICO:FIN -->', bloque);
writeFileSync('index.html', html);
console.log('Generados: cv.md, cv.en.md, llms.txt, JSON-LD y bloque estático de index.html');
