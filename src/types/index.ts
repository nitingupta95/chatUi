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

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  memberProfile: UserProfile;
}
export interface UserProfile {
  skills: string[];
  pastCompanies: string[];
  domains?: string[];
  experienceLevel?: "junior" | "mid" | "senior";
  yearsOfExperience?: number;
  experienceYears?: number; // Deprecated, use yearsOfExperience
  preferences?: string[];
}

export type Theme = 'light' | 'dark';