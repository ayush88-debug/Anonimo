import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runtime = 'edge';

export async function GET() {
    try {
        const prompt = `
            You are a creative assistant for an anonymous social messaging platform similar to Qooh.me.

            Your task is to generate a single string that contains exactly three unique, open-ended questions. These questions should:
            - Encourage friendly, thoughtful, or playful interaction
            - Be safe and suitable for a diverse, anonymous audience
            - Avoid all personal, political, or sensitive topics
            - Focus on universal themes like hobbies, ideas, creativity, humor, or light introspection

            Each time you're called, generate a **fresh and different** set of questions—do not reuse or repeat previous examples or formats.

            Format the output as a **single string**, separating the questions with double pipes like this:  
            Question 1||Question 2||Question 3||Question 4

            Keep questions short, simple, and engaging.

            Do **not** include any explanation or intro—return only the formatted string of questions.
            Get quirky, funny, and thoughtful message ideas to spark more interactions.
            give me 4 quesions strickty please.
            `;

        const response = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        let fullText = '';
        for await (const chunk of response) {
            fullText += chunk.text || '';
        }

        return  Response.json({
            success: true,
            message:"Successfully fetched suggesions",
            fullText
        },{status:200});

    } catch {
        return  Response.json({
            success: false,
            message: 'Please, try again later',
        },{status:500});
    }
}
