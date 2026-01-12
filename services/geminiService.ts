import { GoogleGenAI, Type } from "@google/genai";
import { BookDetails, MarketingContentType } from '../types';

export const generateMarketingContent = async (
  book: BookDetails,
  type: MarketingContentType,
  tone: string = 'Inspirational & Authoritative'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let strategicTask = "";
  switch (type) {
    case MarketingContentType.SOCIAL_POST:
      strategicTask = `Create 3 distinct social media posts (LinkedIn, Instagram, Twitter). Focus on the "Wealth Architecture" concept.`;
      break;
    case MarketingContentType.EMAIL_NEWSLETTER:
      strategicTask = `Draft a high-conversion sales email for "${book.title}". Focus on the pain of financial stagnation vs the power of design.`;
      break;
    case MarketingContentType.BLOG_OUTLINE:
      strategicTask = `Generate a comprehensive blog post outline titled "Why You Aren't Rich (Yet): The Missing Architecture of Wealth."`;
      break;
    case MarketingContentType.BLOG_FULL:
      strategicTask = `Write a full 1,500-word SEO-optimized blog post based on one of the 7 Laws of Money. Use strong subheadings and a clear call to action.`;
      break;
    case MarketingContentType.AD_COPY:
      strategicTask = `Write 3 versions of Facebook Ad copy focusing on benefit-driven hooks.`;
      break;
  }

  const fullPrompt = `
    You are a luxury brand marketing strategist and professional ghostwriter. 
    Write content for "${book.title}" by ${book.author}.
    TONE: ${tone}
    BOOK DESCRIPTION: ${book.description}
    TASK: ${strategicTask}
    
    Format with clean Markdown and use high-impact language.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The marketing engine is currently offline. Please check your API configuration.";
  }
};

export const generateCampaign = async (
  book: BookDetails,
  durationDays: number = 7
): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `As a professional ghostwriter for ${book.author}, author of ${book.title}, architect a ${durationDays}-day automated marketing campaign.
    Return a JSON array of posts.
    Each object must have: 
    - "type": "SOCIAL_POST" or "BLOG_FULL"
    - "platform": (e.g., "LinkedIn", "Twitter", "Instagram", "Official Blog")
    - "content": The full text content.
    - "dayOffset": (number from 0 to ${durationDays - 1})
    - "headline": (short title for the post)

    Use the 7 Laws of Money as the core content strategy.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            platform: { type: Type.STRING },
            content: { type: Type.STRING },
            dayOffset: { type: Type.NUMBER },
            headline: { type: Type.STRING }
          },
          required: ["type", "platform", "content", "dayOffset", "headline"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const chatWithBook = async (
  book: BookDetails,
  userQuestion: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are the voice of "Rich By Design" by Morgan Haze.
    Tone: Wise, authoritative, and encouraging.
    Context: The user is asking about financial freedom and wealth building based on the book's 7 laws.
    Always encourage intentional design over luck.
  `;

  try {
    const contents = [...history, { role: 'user', parts: [{ text: userQuestion }] }];
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text || "I am reflecting on your query. Please rephrase it.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connecting to the wealth vault... please try again in a moment.";
  }
};
