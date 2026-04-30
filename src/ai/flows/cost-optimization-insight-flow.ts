'use server';
/**
 * @fileOverview An AI agent that analyzes ingredient usage and price data to suggest optimal procurement strategies.
 *
 * - analyzeProcurementStrategy - A function that handles the cost optimization analysis process.
 * - CostOptimizationInsightInput - The input type for the analyzeProcurementStrategy function.
 * - CostOptimizationInsightOutput - The return type for the analyzeProcurementStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const IngredientDataSchema = z.object({
  name: z.string().describe('The name of the ingredient.'),
  unit: z.string().describe('The unit of measure for the ingredient (e.g., "kg", "gram", "piece").'),
  bulkPrice: z.number().positive().describe('The price per unit when the ingredient is bought in bulk.'),
  retailPrice: z.number().positive().describe('The price per unit when the ingredient is bought at retail.'),
  weeklyUsage: z.number().positive().describe('The estimated weekly usage of the ingredient in its defined unit.'),
});

const CostOptimizationInsightInputSchema = z.object({
  ingredients: z.array(IngredientDataSchema).min(1).describe('A list of ingredients with their pricing and usage data.'),
});
export type CostOptimizationInsightInput = z.infer<typeof CostOptimizationInsightInputSchema>;

// Output Schema
const RecommendationSchema = z.object({
  ingredientName: z.string().describe('The name of the ingredient for which the recommendation is made.'),
  strategy: z.enum(['Buy in Bulk', 'Consider Retail', 'Monitor Usage', 'Negotiate Price', 'Reduce Waste']).describe('The recommended procurement strategy.'),
  reason: z.string().describe('The detailed explanation for the recommended strategy.'),
  potentialSavings: z.string().optional().describe('An estimated potential cost saving (e.g., "$100/week" or "15% reduction") if the strategy is adopted.'),
});

const CostOptimizationInsightOutputSchema = z.object({
  overallSummary: z.string().describe('A high-level summary of the overall cost optimization insights.'),
  recommendations: z.array(RecommendationSchema).describe('A list of specific procurement recommendations for each ingredient.'),
});
export type CostOptimizationInsightOutput = z.infer<typeof CostOptimizationInsightOutputSchema>;

// Wrapper function
export async function analyzeProcurementStrategy(input: CostOptimizationInsightInput): Promise<CostOptimizationInsightOutput> {
  return costOptimizationInsightFlow(input);
}

// Prompt definition
const prompt = ai.definePrompt({
  name: 'costOptimizationInsightPrompt',
  input: { schema: CostOptimizationInsightInputSchema },
  output: { schema: CostOptimizationInsightOutputSchema },
  prompt: `You are an expert restaurant cost optimization consultant. Your goal is to analyze the provided ingredient usage and price data for a restaurant and provide actionable procurement strategies to reduce ingredient costs and maximize profitability.

Consider the following factors for each ingredient:
1.  **Price Difference**: Compare 'bulkPrice' vs 'retailPrice' per unit.
2.  **Weekly Usage**: How much of the ingredient is consumed weekly. High usage might favor bulk, but consider storage and spoilage.
3.  **Cost Savings**: Estimate potential savings by switching procurement strategies.

For each ingredient, recommend one of the following strategies:
-   "Buy in Bulk": If bulk buying offers significant savings and weekly usage justifies it without high risk of spoilage.
-   "Consider Retail": If weekly usage is low, or the price difference between bulk and retail is minimal, or spoilage is a high risk for bulk purchases.
-   "Monitor Usage": If usage patterns are inconsistent or very low, suggesting a need to track usage more closely before making a decision.
-   "Negotiate Price": If the price seems high compared to typical market rates, especially for high-volume items.
-   "Reduce Waste": If current usage is high but inefficiencies might be leading to excessive consumption.

Provide a concise "overallSummary" of your findings and then detailed "recommendations" for each ingredient.
Make sure to explain your reasoning clearly and estimate potential savings where applicable.

Ingredient Data:
{{#each ingredients}}
- Name: {{{name}}}, Unit: {{{unit}}}, Bulk Price: {{{bulkPrice}}}, Retail Price: {{{retailPrice}}}, Weekly Usage: {{{weeklyUsage}}}
{{/each}}
`,
});

// Flow definition
const costOptimizationInsightFlow = ai.defineFlow(
  {
    name: 'costOptimizationInsightFlow',
    inputSchema: CostOptimizationInsightInputSchema,
    outputSchema: CostOptimizationInsightOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
