/**
 * Avisa al servidor de que alguien abrió la página, para que Eduardo se entere por Telegram. Una sola vez por pestaña.
 * Es "disparar y olvidar": si falla (sin red, servidor caído) nadie lo nota, y nunca retrasa la carga.
 * El servidor decide qué se avisa (omite rastreadores, repeticiones y tus propias IPs); aquí solo se envía lo que la
 * página ya conoce. Ver public/privacidad.html para lo que se registra.
 */
const WS_URL = import.meta.env.VITE_WS_URL || '';
const CLAVE = 'visita_avisada';

export function avisarVisita(): void {
  try {
    if (!WS_URL || sessionStorage.getItem(CLAVE)) return;
    sessionStorage.setItem(CLAVE, '1');
    const base = WS_URL.replace(/^ws/, 'http');
    void fetch(`${base}/api/visita`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        ruta: location.pathname + location.search,
        referrer: document.referrer || undefined,
        idioma: navigator.language,
        pantalla: `${window.innerWidth}x${window.innerHeight}`,
      }),
    }).catch(() => { /* sin red o servidor caído: no pasa nada */ });
  } catch { /* sessionStorage bloqueado o similar: no pasa nada */ }
}
