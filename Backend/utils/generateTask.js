import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from environment variables!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTaskDetails = async (userInput) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are a helpful productivity assistant. Based on the following user input, respond ONLY with a valid JSON object with these two fields:
  - "title": a clear and concise task title (string)
  - "description": a detailed and structured task description (string)
  
  DO NOT include any markdown, code block formatting, explanations, or any other text. Respond ONLY with the JSON object.
  
  User input: "${userInput}"
  `;

  const result = await model.generateContent(prompt);
  const rawText =  result.response.text();


  const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const cleanJson = jsonMatch ? jsonMatch[1] : rawText;

  try {
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Failed to parse Gemini response:", cleanJson);
    throw new Error("AI response parsing failed");
  }
};

