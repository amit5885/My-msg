import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

const categories = [
  "hobbies and interests",
  "travel and adventure",
  "food and cuisine",
  "creativity and art",
  "future aspirations",
  "entertainment",
  "learning and growth",
  "hypothetical scenarios",
  "simple pleasures",
];

export async function POST() {
  try {
    const selectedCategories = categories
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const prompt = `Create a list of three unique, open-ended, and engaging questions, one about each of these topics: ${selectedCategories.join(", ")}. 
    Format as a single string with questions separated by '||'.
    These questions are for an anonymous social messaging platform like Qooh.me.
    Make them suitable for a diverse audience, avoiding personal or sensitive topics.
    Focus on universal themes that encourage friendly interaction.
    Each question should be different from previous ones and specifically relate to its assigned category.
    Make sure each question is intriguing, fosters curiosity, and contributes to a positive conversation.
    Current timestamp: ${Date.now()} (use this to ensure variety).
    
    Example format: "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?"`;

    const result = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
      maxTokens: 125,
      temperature: 0.8,
    });

    const response = result.text;

    return Response.json({ text: response }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({ error: err.message }, { status: 500 });
    }
  }
  return Response.json({ error: "Unknown error" }, { status: 500 });
}
