'use server';

/**
 * @fileOverview Provides evidence supporting the classification of fake news.
 *
 * - provideEvidence - A function that takes a news article and classification as input and returns a counter-response.
 * - ProvideEvidenceInput - The input type for the provideEvidence function.
 * - ProvideEvidenceOutput - The return type for the provideEvidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchWebForEvidence } from '@/ai/tools/web-search-tool';

const ProvideEvidenceInputSchema = z.object({
  article: z.string().describe('The content of the news article.'),
  classification: z.enum(['Real', 'Fake']).describe('The classification of the news article.'),
  articleUrl: z.string().url().optional().describe('The URL of the news article, if available.'),
});
export type ProvideEvidenceInput = z.infer<typeof ProvideEvidenceInputSchema>;

const SupportingLinkSchema = z.object({
    title: z.string().describe("The title of the linked article."),
    url: z.string().url().describe("The URL of the linked article."),
});

const ProvideEvidenceOutputSchema = z.object({
  counterResponse: z.string().describe("A detailed counter-response that debunks the claims in the provided article, explaining what is incorrect and providing corrected information. If the article is real, this should state that the facts are supported. If the web search fails, this field should explain the error."),
  supportingLinks: z.array(SupportingLinkSchema).describe("A list of articles from other sources that support the analysis. MUST be populated from the web search results. Can be an empty array if no relevant sources are found or if the web search fails."),
  confidenceScore: z.number().describe('A score between 0 and 1 indicating the confidence in the counter-response.'),
});
export type ProvideEvidenceOutput = z.infer<typeof ProvideEvidenceOutputSchema>;

export async function provideEvidence(input: ProvideEvidenceInput): Promise<ProvideEvidenceOutput> {
  return provideEvidenceFlow(input);
}

const provideEvidencePrompt = ai.definePrompt({
  name: 'provideEvidencePrompt',
  input: {schema: ProvideEvidenceInputSchema},
  output: {schema: ProvideEvidenceOutputSchema},
  tools: [searchWebForEvidence],
  prompt: `You are a world-class fact-checking AI. Your primary function is to use the 'searchWebForEvidence' tool to get live web search results to verify claims. Your response MUST be a JSON object matching the required schema.

**Article to Analyze:**
Article: {{{article}}}
Classification: {{{classification}}}
{{#if articleUrl}}
Source URL: {{{articleUrl}}}
{{/if}}

**CRITICAL INSTRUCTIONS:**
1.  First, carefully read the "Article to Analyze" and identify its core topic and main claims.
2.  Synthesize these claims into a concise and specific search query (5-10 words) that is likely to find relevant fact-checking articles. For example, if the article claims "Studies show chocolate cures cancer," a good query would be "chocolate cures cancer fact check" or "scientific studies chocolate cancer."
3.  You **MUST** then immediately call the \`searchWebForEvidence\` tool with this specific query. **DO NOT ANSWER FROM MEMORY.**
4.  After calling the tool, inspect its output.
    - If the tool output contains an \`error\` field, your \`counterResponse\` **MUST** report this error to the user. State that the web search failed and suggest they check their Tavily API key in the \`.env\` file. In this case, \`supportingLinks\` **MUST** be an empty array.
    - If there is no error and the tool returns results, you **MUST** populate the \`supportingLinks\` field using the titles and URLs from the tool's results. Use the exact, full URLs. This is mandatory. Even if the article is real, you must provide the links that support this. Your \`counterResponse\` should then be based entirely on the information from these links.
5.  If the tool returns no results but also no error, state in your \`counterResponse\` that no relevant supporting sources could be found on the web after a live search. The \`supportingLinks\` field **MUST** be an an empty array.

Based on the tool's results, provide your analysis.
  `,
});

const provideEvidenceFlow = ai.defineFlow(
  {
    name: 'provideEvidenceFlow',
    inputSchema: ProvideEvidenceInputSchema,
    outputSchema: ProvideEvidenceOutputSchema,
  },
  async input => {
    const {output} = await provideEvidencePrompt(input);
    if (!output) {
      // Fallback in case the model fails to return a valid JSON object
      return {
        counterResponse: "The AI model failed to return a valid analysis. Please try again.",
        confidenceScore: 0.0,
        supportingLinks: [],
      };
    }
    return output;
  }
);
