'use server';
/**
 * @fileOverview Classifies a news article as 'Real' or 'Fake' using AI.
 *
 * - classifyNewsArticle - A function that classifies a news article.
 * - ClassifyNewsArticleInput - The input type for the classifyNewsArticle function.
 * - ClassifyNewsArticleOutput - The return type for the classifyNewsArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyNewsArticleInputSchema = z.object({
  articleContent: z.string().describe('The content of the news article to classify.'),
});
export type ClassifyNewsArticleInput = z.infer<typeof ClassifyNewsArticleInputSchema>;

const ClassifyNewsArticleOutputSchema = z.object({
  classification: z.enum(['Real', 'Fake', 'Question']).describe('The classification of the news article, or if it is a question.'),
  confidence: z.number().describe('Confidence score in the classification (0-1).'),
});
export type ClassifyNewsArticleOutput = z.infer<typeof ClassifyNewsArticleOutputSchema>;

export async function classifyNewsArticle(input: ClassifyNewsArticleInput): Promise<ClassifyNewsArticleOutput> {
  return classifyNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyNewsArticlePrompt',
  input: {schema: ClassifyNewsArticleInputSchema},
  output: {schema: ClassifyNewsArticleOutputSchema},
  prompt: `You are an expert in text analysis. Your primary task is to determine if the user has provided a news article for fact-checking or if they are asking a general question.

Analyze the following text:
Text: {{{articleContent}}}

- If the text appears to be a news article (i.e., it has a headline, paragraphs, and reports on events), classify it as "Real" or "Fake" based on its likely veracity.
- If the text is clearly a question (e.g., starts with "what is," "who is," "explain," etc.), classify it as a "Question".

Respond ONLY with a JSON object in the following format: {"classification": "Real" | "Fake" | "Question", "confidence": number}. The confidence score should be between 0 and 1. Do not include any other explanation.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const classifyNewsArticleFlow = ai.defineFlow(
  {
    name: 'classifyNewsArticleFlow',
    inputSchema: ClassifyNewsArticleInputSchema,
    outputSchema: ClassifyNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
