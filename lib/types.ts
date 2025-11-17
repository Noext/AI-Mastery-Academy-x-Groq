import { ModelKey } from './groqModels';

export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  mode: ModelKey;
}

