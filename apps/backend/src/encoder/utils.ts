import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  ImagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { LLMChain } from 'langchain/chains';
import { appEnv } from '../config';

const captionerModel = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  maxTokens: 256,
  temperature: 0,
  openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
});

const humanPrompt = new HumanMessagePromptTemplate([
  PromptTemplate.fromTemplate(
    'Can you please tell me what is displayed on this image? Ignore texts in it',
  ),
  new ImagePromptTemplate({
    template: { url: '{image}' },
    inputVariables: ['image'],
  }),
]);

const mainPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    'You are an image captioner, returning a 20 words summary about what you see in any image. REMEMBER to keep it short',
  ),
  humanPrompt,
]);

const chain = new LLMChain({ llm: captionerModel, prompt: mainPrompt });

export const caption = async (image: string): Promise<string> => {
  // HTTP URL or base64 image
  const response = await chain.invoke({
    image,
  });
  return response['text'];
};
