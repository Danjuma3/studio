
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Genkit initialization with explicit API key handling.
 * Passing the key directly to the plugin helps avoid environment lookup failures.
 */
export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY 
    })
  ],
  model: 'googleai/gemini-2.5-flash',
});
