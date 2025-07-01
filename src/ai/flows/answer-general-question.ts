'use server';
/**
 * @fileOverview Answers a general question from the user.
 *
 * - answerGeneralQuestion - A function that answers a user's question.
 * - AnswerGeneralQuestionInput - The input type for the answerGeneralQuestion function.
 * - AnswerGeneralQuestionOutput - The return type for the answerGeneralQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerGeneralQuestionInputSchema = z.object({
  question: z.string().describe("The user's question."),
});
export type AnswerGeneralQuestionInput = z.infer<typeof AnswerGeneralQuestionInputSchema>;

const AnswerGeneralQuestionOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the question."),
});
export type AnswerGeneralQuestionOutput = z.infer<typeof AnswerGeneralQuestionOutputSchema>;

export async function answerGeneralQuestion(input: AnswerGeneralQuestionInput): Promise<AnswerGeneralQuestionOutput> {
  return answerGeneralQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerGeneralQuestionPrompt',
  input: {schema: AnswerGeneralQuestionInputSchema},
  output: {schema: AnswerGeneralQuestionOutputSchema},
  prompt: `You are a helpful and knowledgeable AI assistant, like ChatGPT. Provide a comprehensive and detailed answer to the following question, formatted nicely for readability (e.g., with paragraphs or lists).\n\nQuestion: {{{question}}}\n\nRespond ONLY with a JSON object matching the required schema. Your answer should be inside the "answer" field.`,
});

const answerGeneralQuestionFlow = ai.defineFlow(
  {
    name: 'answerGeneralQuestionFlow',
    inputSchema: AnswerGeneralQuestionInputSchema,
    outputSchema: AnswerGeneralQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
