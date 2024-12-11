import { OpenAI } from '@langchain/openai';
import { appEnv } from 'src/config';

const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

const captionerModel = new OpenAI({
  modelName: 'gpt-4o',
  maxTokens: 256,
  temperature: 0,
  openAIApiKey: appEnv.OPENAI_ACCESS_TOKEN,
});

export async function getImageCaptions(images: string[]): Promise<string[]> {
  try {
    const captions = await Promise.all(
      images.map(async (img) => {
        let mimeType: string | null = null;

        if (img.startsWith('data:')) {
          mimeType = img.substring(5, img.indexOf(';'));
        } else if (img.startsWith('http')) {
          const response = await fetch(img, { method: 'HEAD' });
          mimeType = response.headers.get('content-type');
        }

        if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
          throw new Error(
            'Unsupported image format. Allowed formats: png, jpeg, gif, webp.',
          );
        }

        const response = await captionerModel.invoke([
          `Please provide a concise description of the visual content in the provided image. Focus only on what is visibly depicted and ignore any textual elements within the image. \n\nImage: ${img}`,
        ]);

        return response;
      }),
    );

    return captions;
  } catch (error) {
    console.error('Error captioning image:', error);
    return [];
  }
}
