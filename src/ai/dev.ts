import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-pdf-photo.ts';
import '@/ai/flows/provide-evidence.ts';
import '@/ai/flows/classify-news-article.ts';
import '@/ai/flows/explain-classification.ts';
import '@/ai/flows/answer-general-question.ts';
import '@/ai/tools/web-search-tool.ts'; // Register the new tool
