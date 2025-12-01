import React from 'react';
import { Project, Skill, Experience, Education } from './types';

// --- ICONS (Inline SVGs for portability) ---
export const Icons = {
  Code: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Bug: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M12 14h.01M12 11h.01M12 8h.01M7 20h4a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>,
  Database: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Terminal: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Cpu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  GitHub: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
  LinkedIn: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
  WhatsApp: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Robot: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Delete: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Sparkles: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Bot: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
};

// --- PROFILE INFO ---
export const PROFILE = {
  name: "Eduardo Navarro",
  title: "QA Automation Engineer & Full Stack Developer",
  tagline: "Garantizando calidad a través del código y potenciando pruebas con Inteligencia Artificial.",
  email: "edudevcol@gmail.com",
  github: "https://github.com/edudevcol",
  linkedin: "https://www.linkedin.com/in/eduardonavarroecheverria",
  whatsapp: "https://wa.me/+573001244352",
  location: "Cartagena, Colombia",
  telefono: "+57 3001244352",
  photoUrl: "/foto-portfolio-r.png", 
  cv: "/EDUARDONAVARRO2025_CV.pdf"
};

// --- SKILLS ---
export const SKILLS: Skill[] = [
  { name: "LLMs (Gemini, GPT, OpenAI)", category: "AI", icon: <Icons.Robot />, level: 70 },
  { name: "Selenium WebDriver", category: "Testing", icon: <Icons.Bug />, level: 65 },
  { name: "Playwright", category: "Testing", icon: <Icons.Terminal />, level: 90 },
  { name: "Cypress", category: "Testing", icon: <Icons.Code />, level: 80 },
  { name: "TestComplete", category: "Testing", icon: <Icons.Terminal />, level: 90 },
  { name: "Postman", category: "Testing", icon: <Icons.Terminal />, level: 60 },

  { name: "Node.js", category: "Backend", icon: <Icons.Cpu />, level: 80 },
  { name: "Python", category: "Backend", icon: <Icons.Code />, level: 50 },
  { name: "Java", category: "Backend", icon: <Icons.Code />, level: 65 },
  { name: "SQL", category: "Backend", icon: <Icons.Database />, level: 95 },
  { name: "MongoDB", category: "Backend", icon: <Icons.Database />, level: 60 },

  { name: "TypeScript/JS", category: "Frontend", icon: <Icons.Code />, level: 90 },
  { name: "React", category: "Frontend", icon: <Icons.Code />, level: 80 },

  { name: "Git", category: "Tools", icon: <Icons.Code />, level: 80 },
  { name: "Jira", category: "Tools", icon: <Icons.Code />, level: 90 },
  { name: "Docker", category: "Tools", icon: <Icons.Cpu />, level: 50 },
];

// --- PROJECTS ---
export const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    title: "AI Test Data Generator",
    shortDescription: "Generador de datos de prueba sintéticos utilizando modelos LLM.",
    fullDescription: "Una aplicación full-stack que permite a los equipos de QA generar grandes volúmenes de datos de prueba realistas pero anónimos utilizando la API de Gemini. Resuelve el problema de la privacidad de datos en entornos de staging.",
    technologies: ["React", "Node.js", "Gemini API", "MongoDB"],
    image: "https://picsum.photos/800/600?random=1",
    repoUrl: "https://github.com/alexdev/ai-test-gen",
    features: ["Generación de JSON/CSV", "Schemas personalizables", "Validación de tipos de datos", "Exportación masiva"]
  },
  {
    id: "2",
    title: "E-commerce Automation Suite",
    shortDescription: "Framework de automatización escalable para plataformas de comercio electrónico.",
    fullDescription: "Un framework robusto construido con Playwright y TypeScript que implementa el patrón Page Object Model. Cubre flujos críticos como checkout, búsqueda y gestión de usuarios, ejecutándose diariamente en Jenkins.",
    technologies: ["Playwright", "TypeScript", "Jenkins", "Docker"],
    image: "https://picsum.photos/800/600?random=2",
    repoUrl: "https://github.com/alexdev/ecommerce-auto",
    features: ["Reportes HTML detallados", "Ejecución paralela", "Capturas de pantalla en fallo", "Integración con Slack"]
  },
  {
    id: "3",
    title: "Bug Tracker Dashboard",
    shortDescription: "Dashboard visual para seguimiento de defectos e integración con Jira.",
    fullDescription: "Interfaz de usuario moderna para visualizar métricas de calidad en tiempo real. Se conecta a la API de Jira para mostrar tendencias de bugs, tiempo de resolución y cobertura de pruebas por sprint.",
    technologies: ["React", "Chart.js", "Jira API", "Express"],
    image: "https://picsum.photos/800/600?random=3",
    demoUrl: "https://bugtracker-demo.com",
    features: ["Gráficos interactivos", "Filtros avanzados", "Modo oscuro", "Alertas de umbral de bugs"]
  }
];

// --- EXPERIENCE ---
export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "Senior QA Automation Engineer",
    company: "Sociedad Portuaria Regional de Cartagena",
    period: "2020 - Presente",
    description: `Diseño e implemento soluciones de automatización de pruebas con Selenium y Playwright para garantizar la calidad de aplicaciones web críticas, a la vez que lidero el desarrollo de una plataforma con inteligencia artificial capaz de generar automáticamente casos de prueba, criterios de aceptación y documentarlos directamente en Jira y Confluence. Además, desarrollé una herramienta de generación de datos sintéticos basada en modelos LLM que resuelve problemas de privacidad y optimiza los entornos de staging, y construí una aplicación web que transforma casos de prueba redactados en lenguaje natural en scripts automatizados listos para ejecutar mediante el uso de IA generativa.`
  },
  {
    id: "2",
    role: "Analista de Sistemas",
    company: "Calzado Latino",
    period: "2017 - 2019",
    description: `Desarrollé funcionalidades en entornos de escritorio utilizando VB .Net y gestioné bases de datos con SQL Server. Brindé soporte técnico (Helpdesk) a usuarios internos, resolviendo incidencias de hardware, software y aplicaciones corporativas. Elaboré reportes y automatizaciones en Excel mediante macros y VBA, optimizando tareas repetitivas en distintas áreas de la organización. Trabajé con herramientas del ecosistema Microsoft Office en diversas actividades administrativas y de análisis.`
  }
];

// --- EDUCATION ---
export const EDUCATION: Education[] = [
  {
    id: "1",
    degree: "Ingeniería en Sistemas",
    institution: "Universidad de Cartagena",
    year: "2016"
  },
  {
    id: "2",
    degree: "Full Stack Developer Web (TypeScript/JS, React, Node.js, Express, MongoDB, SQL, Java)",
    institution: "Bootcamp Coderhouse",
    year: "2024"
  }
];

// --- AI CONTEXT ---
// This string is fed to the LLM to answer questions about the portfolio owner.
export const RESUME_CONTEXT = `
Eres un asistente de IA útil y profesional encargado de responder preguntas sobre el perfil profesional de ${PROFILE.name}.
Usa la siguiente información como contexto y fuente de verdad. Si te preguntan algo que no está aquí, di amablemente que no tienes esa información específica pero ofrece contactar a ${PROFILE.name} a través del formulario.

Perfil: ${PROFILE.title}.
Resumen: ${PROFILE.tagline}.
Ubicación: ${PROFILE.location}.

Habilidades Técnicas:
${SKILLS.map(s => `- ${s.name} (${s.category})`).join('\n')}

Experiencia Laboral:
${EXPERIENCE.map(e => `- ${e.role} en ${e.company} (${e.period}): ${e.description}`).join('\n')}

Educación:
${EDUCATION.map(e => `- ${e.degree} en ${e.institution} (${e.year})`).join('\n')}

Proyectos Destacados:
${INITIAL_PROJECTS.map(p => `- ${p.title}: ${p.shortDescription} (Tecnologías: ${p.technologies.join(', ')})`).join('\n')}

Datos de Contacto:
- Email: ${PROFILE.email}
- LinkedIn: ${PROFILE.linkedin}
- GitHub: ${PROFILE.github}
- WhatsApp: ${PROFILE.whatsapp}
- Teléfono: ${PROFILE.telefono}

Estilo de respuesta: Sé conciso, breve, profesional pero amable. Habla en primera persona del singular (ej: "Yo tengo experiencia en..."). El objetivo es que el reclutador se interese en contratarte (Eres Eduardo Navarro). Responde solo texto plano.
`;