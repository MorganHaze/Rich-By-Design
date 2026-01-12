import { GoogleGenAI, Type } from "@google/genai";
import { BookDetails, MarketingContentType } from '../types';

export const generateMarketingImage = async (
  prompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fullPrompt = `Create a high-impact, professional financial social media graphic in the style of "Rich by Design HQ". 
  STYLE: Clean, modern, authoritative. 
  COLORS: Premium Navy Blue (#102a43) and Gold (#f59e0b) on a textured white background.
  THEME: Financial Architecture. 
  CONCEPT: ${prompt}. 
  If the prompt suggests a comparison, use a "split-screen" or "side-by-side" layout with two distinct icons or simplified characters (like silhouettes or clean 2D avatars) representing different financial choices. 
  Ensure the visual is clear, premium, and professional. Avoid complex text within the image; focus on visual storytelling.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: fullPrompt }] },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return "";
  } catch (error) {
    console.error("Image Generation Error:", error);
    return "";
  }
};

export const generateMarketingContent = async (
  book: BookDetails,
  type: MarketingContentType,
  tone: string = 'Inspirational & Authoritative'
): Promise<{ text: string, imagePrompt?: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let strategicTask = "";
  switch (type) {
    case MarketingContentType.SOCIAL_POST:
      strategicTask = `Create 1 high-impact social media post. Focus on the contrast between "Income" and "Wealth" or "Luck" and "Design". Include a detailed description for an accompanying side-by-side comparison infographic.`;
      break;
    case MarketingContentType.EMAIL_NEWSLETTER:
      strategicTask = `Draft a high-conversion sales email for "${book.title}".`;
      break;
    case MarketingContentType.BLOG_FULL:
      strategicTask = `Write a full 1,500-word SEO-optimized blog post based on one of the 7 Laws of Money.`;
      break;
    default:
      strategicTask = `Generate marketing copy for: ${type}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a luxury brand marketing strategist for ${book.author}. 
    TASK: ${strategicTask}
    BOOK: ${book.title}
    TONE: ${tone}
    
    If it's a social post, provide the content and a separate "image_prompt" field describing a visual comparison (e.g., Character A vs Character B, or Bad System vs Good System). 
    Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          image_prompt: { type: Type.STRING }
        },
        required: ["text"]
      }
    }
  });

  const res = JSON.parse(response.text);
  return { text: res.text, imagePrompt: res.image_prompt };
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
    - "platform": (e.g., "LinkedIn", "Instagram", "Twitter", "Official Blog")
    - "content": The full text content.
    - "imagePrompt": A detailed description for an AI image generator to create a side-by-side comparison infographic or a visual metaphor of wealth architecture.
    - "dayOffset": (number from 0 to ${durationDays - 1})
    - "headline": (short title for the post)

    Focus on the "Seven Laws" and specifically include posts that compare different financial paths (e.g. The Spender vs The Architect).`,
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
            imagePrompt: { type: Type.STRING },
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
