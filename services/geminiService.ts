
import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/imageUtils";

export const processClipart = async (file: File): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = await fileToBase64(file);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type || 'image/png',
            },
          },
          {
            text: 'Extract the subject from this clipart. Return the subject exactly as it appears, but replace the ENTIRE background with a flat, solid #00FF00 (Neon Green). Crucially: 1. Fill all gaps inside typography (like the holes in A, O, B) and gaps between leaves or objects with #00FF00. 2. DO NOT change internal subject colors (keep white eyes white, keep white teeth white). 3. Ensure the edges are sharp and clean. Return ONLY the image.',
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error('No image returned from Gemini');
  } catch (error) {
    console.error('Gemini Processing Error:', error);
    throw error;
  }
};
