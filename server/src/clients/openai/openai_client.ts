import { config } from '@src/config/config';
import OpenAI from 'openai';
import { assistanceRestaurantPrompt } from '@src/clients/openai/prompts/assistanceRestaurant.prompt.openai';
import { isEmpty } from 'lodash';

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

      const chosenMessage = response.choices[0].message.content;

      return isEmpty(chosenMessage)
        ? "I'm sorry, I couldn't understand your request.."
        : String(chosenMessage);
    } catch (error) {
      console.error('Error handling client message:', error);
      return "I'm sorry, I couldn't process your request.";
    }
  }
}
