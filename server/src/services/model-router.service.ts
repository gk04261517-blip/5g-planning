import axios from 'axios';
import { logger } from '../utils/logger';

interface ChatParams {
  message: string;
  context: any[];
  modelType: string;
}

export class ModelRouterService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = process.env.MODEL_API_KEY || '';
    this.apiEndpoint = process.env.MODEL_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  }

  async chat(params: ChatParams): Promise<string> {
    const { message, context, modelType } = params;

    try {
      // 如果没有配置 API Key，返回模拟响应
      if (!this.apiKey) {
        return this.generateMockResponse(message);
      }

      const messages = [
        { role: 'system', content: 'You are a wireless network simulation assistant. Help users understand and optimize their network deployments.' },
        ...context.map((c: any) => ({ role: c.role, content: c.content })),
        { role: 'user', content: message }
      ];

      const response = await axios.post(
        this.apiEndpoint,
        {
          model: modelType === 'advanced' ? 'gpt-4' : 'gpt-3.5-turbo',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      logger.error('Model API call failed:', error);
      return this.generateMockResponse(message);
    }
  }

  async listModels(): Promise<any[]> {
    return [
      { id: 'default', name: 'Default Model', description: 'Standard assistant for network simulation' },
      { id: 'advanced', name: 'Advanced Model', description: 'Advanced model with deeper technical knowledge' }
    ];
  }

  private generateMockResponse(message: string): string {
    const responses = [
      `I've analyzed your request about "${message.substring(0, 50)}...". Based on typical wireless network deployments, I recommend considering the following factors: base station density, transmit power levels, and environmental obstacles.`,
      `For your simulation query, here are some suggestions: 1) Ensure adequate coverage overlap between cells, 2) Optimize SINR by adjusting power levels, 3) Consider capacity requirements when placing base stations.`,
      `Regarding "${message.substring(0, 30)}...": In wireless network planning, coverage and capacity are often trade-offs. You may need to run multiple simulations to find the optimal configuration for your specific scenario.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
