// This is an automatically generated file. Please do not edit. 
'use server';
/**
 * @fileOverview Explains the classification of an article as real or fake.
 *
 * - explainClassification - A function that handles the explanation process.
 * - ExplainClassificationInput - The input type for the explainClassification function.
 * - ExplainClassificationOutput - The return type for the explainClassification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainClassificationInputSchema = z.object({
  articleContent: z.string().describe('The content of the news article.'),
  classification: z.enum(['Real', 'Fake']).describe('The classification of the article.'),
});
export type ExplainClassificationInput = z.infer<typeof ExplainClassificationInputSchema>;

const ExplainClassificationOutputSchema = z.object({
  explanation: z.string().describe('A concise explanation justifying the classification.'),
  confidenceScore: z.number().describe('A confidence score (0-1) for the classification.'),
  evidence: z.string().optional().describe('Evidence supporting the classification, if available.'),
});
export type ExplainClassificationOutput = z.infer<typeof ExplainClassificationOutputSchema>;

export async function explainClassification(input: ExplainClassificationInput): Promise<ExplainClassificationOutput> {
  return explainClassificationFlow(input);
}

const explainClassificationPrompt = ai.definePrompt({
  name: 'explainClassificationPrompt',
  input: {schema: ExplainClassificationInputSchema},
  output: {schema: ExplainClassificationOutputSchema},
  prompt: `You are an AI assistant that explains why a news article was classified as Real or Fake.

  Article Content: {{{articleContent}}}
  Classification: {{{classification}}}

  Provide a concise explanation justifying the classification, a confidence score (0-1) for the classification, and any available evidence.
  The confidence score represents how sure you are that the Classification is correct.

  Explanation:
  `, 
});

const explainClassificationFlow = ai.defineFlow(
  {
    name: 'explainClassificationFlow',
    inputSchema: ExplainClassificationInputSchema,
    outputSchema: ExplainClassificationOutputSchema,
  },
  async input => {
    const {output} = await explainClassificationPrompt(input);
    return output!;
  }
);
