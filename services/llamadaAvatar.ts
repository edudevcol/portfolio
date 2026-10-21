/**
 * Pide al asistente flotante que inicie la llamada con el avatar.
 *
 * El avatar tiene un solo lugar donde vive la llamada (UnifiedAssistant). Los botones de la página (barra, Hero, proyecto
 * destacado) no abren otra copia: avisan por este evento. Se despacha de forma síncrona dentro del clic para que el
 * navegador permita abrir el audio (exige un gesto del usuario).
 */
export const EVENTO_INICIAR_LLAMADA = 'iniciar-llamada-avatar';

export function iniciarLlamadaAvatar(): void {
  window.dispatchEvent(new Event(EVENTO_INICIAR_LLAMADA));
}
