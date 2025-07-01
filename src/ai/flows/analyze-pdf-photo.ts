'use server';

/**
 * @fileOverview Analyzes a PDF document or photo for fake news indicators or answers user questions about it.
 *
 * - analyzePdfPhoto - A function that handles the analysis process.
 * - AnalyzePdfPhotoInput - The input type for the analyzePdfPhoto function.
 * - AnalyzePdfPhotoOutput - The return type for the analyzePdfPhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePdfPhotoInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The PDF document or photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  userQuery: z.string().optional().describe('A specific question from the user about the media file.'),
});
export type AnalyzePdfPhotoInput = z.infer<typeof AnalyzePdfPhotoInputSchema>;

const AnalyzePdfPhotoOutputSchema = z.object({
  isFakeNews: z
    .boolean()
    .describe('Whether the PDF document or photo contains fake news indicators, or if the user\'s query points to misleading information.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the classification or the direct answer to the user\'s query.'),
  confidenceScore: z
    .number()
    .describe('The confidence score of the classification, from 0 to 1.'),
  evidence: z.string().optional().describe('Evidence supporting the analysis or quotes from the document.'),
});
export type AnalyzePdfPhotoOutput = z.infer<typeof AnalyzePdfPhotoOutputSchema>;

export async function analyzePdfPhoto(input: AnalyzePdfPhotoInput): Promise<AnalyzePdfPhotoOutput> {
  return analyzePdfPhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePdfPhotoPrompt',
  input: {schema: AnalyzePdfPhotoInputSchema},
  output: {schema: AnalyzePdfPhotoOutputSchema},
  prompt: `You are an expert AI assistant specializing in analyzing documents and images. Your response MUST be in JSON format.

Analyze the content of the following file (PDF document or photo):

{{media url=fileDataUri}}

{{#if userQuery}}
The user has a specific question about this file: "{{{userQuery}}}"

Your task is to answer this question based on the file's content.
- In the "reasoning" field, provide a direct answer to the user's question.
- In the "isFakeNews" field, determine if the content related to the question is misleading or fake. Set to \`false\` if the question is neutral (e.g., a summary request).
- Provide a "confidenceScore" for your analysis.
- If applicable, use the "evidence" field to provide specific details or quotes from the document that support your answer.
{{else}}
Your task is to analyze the provided file for fake news indicators.
- In the "isFakeNews" field, determine if the content contains fake news indicators.
- In the "reasoning" field, provide your reasoning for this classification.
- Provide a "confidenceScore" (0 to 1).
- Use the "evidence" field to detail any specific evidence supporting your classification.
{{/if}}
`,
});

const analyzePdfPhotoFlow = ai.defineFlow(
  {
    name: 'analyzePdfPhotoFlow',
    inputSchema: AnalyzePdfPhotoInputSchema,
    outputSchema: AnalyzePdfPhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
