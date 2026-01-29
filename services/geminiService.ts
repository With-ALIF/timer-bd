
import { GoogleGenAI, Type } from "@google/genai";
import { CountdownEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEventsFromPrompt = async (prompt: string): Promise<CountdownEvent[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a JSON list of events based on this request: "${prompt}". 
               Each event must have a title and a future timestamp (ISO 8601 format). 
               Make sure dates are in the future relative to now.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            time: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["id", "title", "time"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data;
  } catch (error) {
    console.error("Failed to parse AI response", error);
    return [];
  }
};