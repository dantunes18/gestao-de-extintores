
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getSafetyAdvice = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `És um especialista em segurança contra incêndios em Portugal. Responde brevemente à seguinte questão em Português de Portugal: ${question}`,
      config: {
        systemInstruction: "Age como um consultor de segurança industrial especializado em equipamentos de extinção de incêndios e normas portuguesas (NP 4413).",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, não foi possível contactar o assistente de segurança de momento.";
  }
};
