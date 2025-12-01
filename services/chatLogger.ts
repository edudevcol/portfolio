/**
 * Simulates a logging service that would typically send data to a backend.
 * Since this is a client-side portfolio, we log to the console with structured data
 * so developers/interviewers can see the 'backend' activity.
 */

import { ChatMessage } from "../types";

export const logChatInteraction = (message: ChatMessage) => {
  const logEntry = {
    eventId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    actor: message.role,
    contentLength: message.text.length,
    contentPreview: message.text.substring(0, 50) + (message.text.length > 50 ? '...' : ''),
    fullMessage: message.text,
    metadata: {
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
    }
  };

  console.groupCollapsed(`📊 Chat Logger: New Message from [${message.role.toUpperCase()}]`);
  console.log("Event Details:", logEntry);
  console.log("Sending to analytics endpoint... (Simulated)");
  console.groupEnd();

  // Here you would normally do:
  // fetch('/api/logs/chat', { method: 'POST', body: JSON.stringify(logEntry) });
};
