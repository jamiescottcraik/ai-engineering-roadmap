// Shared types for the brAInwav platform

export interface RoadmapNode {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies?: string[];
}

export interface ProgressState {
  [key: string]: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AgentConfig {
  name: string;
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export type LLMProvider = 'openai' | 'anthropic' | 'local' | 'azure';

export interface AIProviderConfig {
  type: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}