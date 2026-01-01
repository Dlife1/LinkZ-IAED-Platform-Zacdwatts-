
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Metadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestMetadata = async (artist: string, genre: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As an AI metadata specialist for LinkZ, suggest professional release metadata for an artist named "${artist}" in the "${genre}" genre. Include possible track titles, BPM, and mood.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
          bpm: { type: Type.NUMBER },
          moods: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketStrategy: { type: Type.STRING, description: "A short strategic insight for this genre" }
        },
        required: ["suggestedTitles", "bpm", "moods", "marketStrategy"]
      }
    }
  });
  
  return JSON.parse(response.text);
};

export const getRadarInsights = async (metadata: Metadata) => {
  const prompt = `Perform a Strategic Analysis using the Gresham Protocol (Synergistic Opportunity Radar) for the following artist release:
    Artist: ${metadata.artist}
    Genre: ${metadata.genre}
    Spatial Audio: ${metadata.spatialAudio ? 'Enabled' : 'Disabled'}
    
    Identify 3 high-probability 'Missions' or 'Sync Opportunities' based on current music trends.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are the LinkZ Genie, a strategic AI for the Gresham Protocol. You provide concise, actionable high-level music industry strategy.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            opportunityName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            action: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["opportunityName", "confidence", "action"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const processGenerativeCommand = async (command: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Process the following LinkZ Command: "${command}". 
    If the command is about deployment, pretend to execute a Cloud Run deployment via MCP. 
    If it's about logs, show mock logs.
    If it's about strategy, provide a Gresham Protocol insight.`,
    config: {
      systemInstruction: "You are the Gresham Protocol CLI Interface. Act as a high-tech terminal output provider. Be helpful, concise, and futuristic.",
    }
  });
  return response.text;
};

/**
 * Transcribes audio data using Gemini 3 Flash.
 * @param base64Audio The audio data in base64 format.
 * @param mimeType The audio mime type (e.g., 'audio/wav').
 */
export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: mimeType } },
        { text: "Transcribe this audio exactly as it is spoken. Only return the transcribed text." }
      ]
    }
  });
  return response.text;
};

/**
 * Performs a search-grounded query for up-to-date industry information.
 */
export const performMarketSearch = async (query: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following industry query using the latest data: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text,
    sources: sources
  };
};

/**
 * Creates a chat session for the LinkZ Assistant using Gemini 3 Pro.
 */
export const createAssistantChat = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are the LinkZ AI Assistant. You help artists manage their releases, understand metadata, and navigate the Gresham Protocol. You are professional, helpful, and technically savvy. Use the user's current project context if provided.",
    },
  });
};
