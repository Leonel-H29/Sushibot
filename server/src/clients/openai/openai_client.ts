import { config } from '@src/config/config';
import OpenAI from 'openai';
import { assistanceRestaurantPrompt } from '@src/clients/openai/prompts/assistanceRestaurant.prompt.openai';
import { get } from 'lodash';

export class OpenAIClient {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai_key,
    });
  }

  async createChatCompletion(message: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: assistanceRestaurantPrompt,
          },
          { role: 'user', content: message },
        ],
      });

      const choices = String(await response.choices[0].message);

      return get(
        choices,
        'content',
        "I'm sorry, I couldn't understand your request."
      );
    } catch (error) {
      console.error('Error handling client message:', error);
      return "I'm sorry, I couldn't process your request.";
    }
  }
}
