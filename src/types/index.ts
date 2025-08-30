export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  id: string;
  title: string;
  url: string;
  type: 'slack' | 'drive' | 'notion' | 'pdf' | 'docx';
  snippet: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type Theme = 'light' | 'dark';