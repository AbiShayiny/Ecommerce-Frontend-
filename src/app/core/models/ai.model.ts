import { Product } from './product.model';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: Product[];
  timestamp: string;
}

