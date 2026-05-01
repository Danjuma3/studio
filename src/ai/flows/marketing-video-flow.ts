'use server';
/**
 * @fileOverview A marketing video generation AI agent using Google Veo.
 * 
 * - generateMarketingVideo - A function that handles the video generation process.
 * - MarketingVideoInput - The input type for the generateMarketingVideo function.
 * - MarketingVideoOutput - The return type for the generateMarketingVideo function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { Readable } from 'stream';

const MarketingVideoInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the user as a data URI (base64)."),
  prompt: z.string().describe("Custom instructions for the video content."),
});
export type MarketingVideoInput = z.infer<typeof MarketingVideoInputSchema>;

const MarketingVideoOutputSchema = z.object({
  videoUrl: z.string().describe("The generated video as a data URI (video/mp4)."),
});
export type MarketingVideoOutput = z.infer<typeof MarketingVideoOutputSchema>;

export async function generateMarketingVideo(input: MarketingVideoInput): Promise<MarketingVideoOutput> {
  return marketingVideoFlow(input);
}

const marketingVideoFlow = ai.defineFlow(
  {
    name: 'marketingVideoFlow',
    inputSchema: MarketingVideoInputSchema,
    outputSchema: MarketingVideoOutputSchema,
  },
  async (input) => {
    const model = googleAI.model('veo-2.0-generate-001');

    // Remove data uri prefix to get raw base64 for the prompt
    const base64Image = input.photoDataUri.split(',')[1];
    const mimeType = input.photoDataUri.split(';')[0].split(':')[1] || 'image/jpeg';

    let { operation } = await ai.generate({
      model: model,
      prompt: [
        { text: input.prompt },
        { media: { url: input.photoDataUri, contentType: mimeType } }
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
        personGeneration: 'allow_adult',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes (polling)
    let maxRetries = 24; // 2 minutes max
    while (!operation.done && maxRetries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      operation = await ai.checkOperation(operation);
      maxRetries--;
    }

    if (operation.error) {
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the output');
    }

    // Fetch the video from the Google URL and convert to base64 data URI
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');

    return {
      videoUrl: `data:video/mp4;base64,${base64Video}`,
    };
  }
);
