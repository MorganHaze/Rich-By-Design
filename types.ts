export enum MarketingContentType {
  SOCIAL_POST = 'SOCIAL_POST',
  EMAIL_NEWSLETTER = 'EMAIL_NEWSLETTER',
  BLOG_OUTLINE = 'BLOG_OUTLINE',
  AD_COPY = 'AD_COPY'
}

export interface MarketingResult {
  content: string;
  type: MarketingContentType;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface BookDetails {
  title: string;
  subtitle: string;
  author: string;
  description: string;
  targetAudience: string;
  keyTakeaways: string[];
  amazonLink?: string;
}
