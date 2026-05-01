
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Genkit initialization with prioritized API key handling.
 * We prioritize GOOGLE_GENAI_API_KEY which is the standard for the plugin.
 */
const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('Genkit: No API key found in environment variables. AI features may fail.');
}

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: apiKey 
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
