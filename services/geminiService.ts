import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { BookDetails, MarketingContentType } from '../types';

export const generateMarketingContent = async (
  book: BookDetails,
  type: MarketingContentType,
  tone: string = 'Inspirational & Authoritative'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  switch (type) {
    case MarketingContentType.SOCIAL_POST:
      prompt = `Create 3 distinct social media posts (one for LinkedIn, one for Instagram, one for Twitter). 
      - LinkedIn: Long-form, professional, focus on "structural wealth."
      - Instagram: Short, punchy, visual hook, focus on "70-10-10-10 rule."
      - Twitter: A thread-starter hook about why people are "fighting a losing battle with money."`;
      break;
    case MarketingContentType.EMAIL_NEWSLETTER:
      prompt = `Draft a high-conversion sales email. 
      - Subject: Something that breaks the pattern of typical finance emails.
      - Body: Start with the problem of "trading time for money," introduce the book as the architectural solution, and end with a strong CTA.`;
      break;
    case MarketingContentType.BLOG_OUTLINE:
      prompt = `Generate a comprehensive blog post outline titled "Why You Aren't Rich (Yet): The Missing Architecture of Wealth." 
      Include 5 main points, sub-points, and a concluding thought that leads to the book "Rich by Design."`;
      break;
    case MarketingContentType.AD_COPY:
      prompt = `Write 3 versions of Facebook Ad copy. 
      - Version 1: Benefit-driven (The "How-to").
      - Version 2: Fear of Missing Out (The "Behind" angle).
      - Version 3: Visionary (The "Legacy" angle).`;
      break;
  }

  const fullPrompt = `
    You are a luxury brand marketing strategist and financial expert. 
    You are writing for the book "${book.title}" by ${book.author}.
    
    TONE: ${tone}
    BOOK DESCRIPTION: ${book.description}
    TARGET AUDIENCE: ${book.targetAudience}
    
    STRATEGIC TASK: ${prompt}
    
    RULES:
    1. Use high-impact, evocative language.
    2. Reference specific laws or concepts from the book (e.g., 70-10-10-10 rule, Law of Paying Yourself First).
    3. Ensure the writing sounds like it comes from a place of deep wisdom and architectural precision.
    4. Format with clean Markdown.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
    });
    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The system is currently syncing. Please check your API_KEY configuration.";
  }
};

export const chatWithBook = async (
  book: BookDetails,
  userQuestion: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    You are the voice of the financial philosophy "Rich By Design" by Morgan Haze.
    Your tone is wise, architectural, encouraging, and authoritative.
    
    CORE PRINCIPLES:
    - Wealth is a design, not an accident.
    - The 70-10-10-10 rule is the foundation.
    - Holistic wealth includes Physical, Emotional, Spiritual, Social, and Financial.
    
    When answering:
    - Be concise and authoritative.
    - Always bring it back to building a "structure" for life.
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: userQuestion });
    return result.text || "Pondering the architecture of that question...";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Frequency interrupted. Visit richbydesignhq.com for the full manual.";
  }
};
