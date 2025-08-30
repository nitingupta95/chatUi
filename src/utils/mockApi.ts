import type { Source } from '../types';

const mockSources: Source[] = [
  {
    id: '1',
    title: 'Project Requirements - Google Drive',
    url: 'https://drive.google.com/file/d/example1',
    type: 'drive',
    snippet: 'The project requirements document outlines the key features and technical specifications for the AURA AI knowledge hub...',
  },
  {
    id: '2',
    title: 'Team Standup Notes - Slack',
    url: 'https://workspace.slack.com/archives/example',
    type: 'slack',
    snippet: 'Daily standup discussion about progress on the AI integration and user interface improvements...',
  },
  {
    id: '3',
    title: 'Architecture Design - Notion',
    url: 'https://notion.so/Architecture-Design-example',
    type: 'notion',
    snippet: 'Detailed system architecture showing the RAG pipeline, vector database integration, and API endpoints...',
  },
];

const mockResponses = [
  {
    content: "Based on your connected data sources, I found relevant information about your project. The latest updates show significant progress on the AI integration components, with the team focusing on improving response accuracy and user experience.",
    sources: [mockSources[0], mockSources[1]],
  },
  {
    content: "I've searched through your documents and found several relevant files. The project requirements indicate a focus on unified knowledge management with AI-powered search capabilities across multiple platforms.",
    sources: [mockSources[0], mockSources[2]],
  },
  {
    content: "From your Slack channels and meeting notes, I can see the team has been discussing implementation strategies for the RAG system and vector embeddings. The architecture documentation provides detailed technical specifications.",
    sources: mockSources,
  },
];

export async function mockApiCall(query: string): Promise<{ content: string; sources: Source[] }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  // Return a random response
  const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  
  return {
    content: `${randomResponse.content}\n\nYour query: "${query}" has been processed using advanced RAG techniques to provide accurate, contextual information from your connected data sources.`,
    sources: randomResponse.sources.slice(0, Math.floor(Math.random() * 3) + 1),
  };
}