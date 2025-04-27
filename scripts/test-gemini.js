import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDt-W_YmTQEYB7lyW2wS7c8UyFq-CyKiYE" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Hello, i want to learn english",
  });
  console.log(response.text);
}

main();