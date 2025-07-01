
/**
 * @fileOverview A tool for performing live web searches using the Tavily API.
 *
 * - searchWebForEvidence - A Genkit tool that performs a web search.
 * - WebSearchInputSchema - Input schema for the search tool.
 * - WebSearchResultSchema - Output schema for a single search result.
 * - WebSearchOutputSchema - Output schema for the search tool (list of results).
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { TavilyClient } from 'tavily';

export const WebSearchInputSchema = z.object({
  query: z.string().describe('The search query to find relevant articles or videos based on the main claims or topics of the news being analyzed.'),
});
export type WebSearchInput = z.infer<typeof WebSearchInputSchema>;

export const WebSearchResultSchema = z.object({
  title: z.string().describe('The title of the found web page or video.'),
  url: z.string().url().describe('The URL of the found resource.'),
  type: z.enum(['article', 'video', 'other']).describe('The type of the resource (e.g., news article, video).'),
});
export type WebSearchResult = z.infer<typeof WebSearchResultSchema>;

export const WebSearchOutputSchema = z.object({
  results: z.array(WebSearchResultSchema).describe('A list of search results.'),
  error: z.string().optional().describe('An error message if the search failed.'),
});
export type WebSearchOutput = z.infer<typeof WebSearchOutputSchema>;

export const searchWebForEvidence = ai.defineTool(
  {
    name: 'searchWebForEvidence',
    description: 'Performs a web search for articles or videos that can act as counter-evidence or supporting material for a news classification. Use this to find external sources.',
    inputSchema: WebSearchInputSchema,
    outputSchema: WebSearchOutputSchema,
  },
  async (input: WebSearchInput): Promise<WebSearchOutput> => {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      const errorMsg = "Tavily API key not found. Please set TAVILY_API_KEY in your .env file.";
      console.error(errorMsg);
      return { results: [], error: errorMsg };
    }

    const tavilyClient = new TavilyClient(apiKey);

    try {
      console.log(`Performing live web search with Tavily for: "${input.query}"`);
      const searchResponse = await tavilyClient.search(input.query, {
        maxResults: 5, // Get up to 5 relevant results
        includeImages: false,
        includeVideos: false,
      });

      console.log(`Tavily search returned ${searchResponse.results.length} results.`);
      
      // Map the Tavily response to our app's expected schema
      const mappedResults: WebSearchResult[] = searchResponse.results.map(item => ({
        title: item.title,
        url: item.url,
        // Tavily doesn't specify a type, so we'll default to 'article' for simplicity.
        type: 'article', 
      }));

      return { results: mappedResults };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred with the search API.";
      console.error("Error calling Tavily Search API:", errorMessage);
      // Return empty results on error to prevent the entire flow from failing.
      return { results: [], error: `Failed to search the web. Please check your Tavily API key and internet connection. Details: ${errorMessage}` };
    }
  }
);
