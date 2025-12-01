import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RESUME_CONTEXT } from "../constants";

// Initialize client carefully.
// In a real production app, we might proxy this through a backend to hide the key,
// but for a personal portfolio client-side demo, this works if restrictions are set on the key.
let ai: GoogleGenAI | null = null;

const apiKey = process.env.API_KEY || '';

const MODEL_NAME = 'gemini-2.5-flash';

if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
} else {
  console.warn("API_KEY environment variable is missing. Chatbot will not function.");
}

export const sendMessageToGemini = async (
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  if (!ai) {
    return "Lo siento, no estoy configurado correctamente (falta API Key).";
  }

  try {
    // We use a fresh generation for each turn to keep it simple and stateless regarding the session,
    // manually appending history to the prompt or using the chat helper.
    // Here, let's use the Chat helper for better context management.
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: RESUME_CONTEXT,
        temperature: 0.7,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "No pude generar una respuesta.";
    
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Hubo un error al procesar tu pregunta. Por favor intenta de nuevo.";
  }
};