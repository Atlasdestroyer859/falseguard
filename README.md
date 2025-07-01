# FalseGuard – AI-powered Misleading News Detector

This is the full codebase for FalseGuard, a web app that uses AI to detect misleading news from articles, PDFs, and images.

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, ShadCN, Tailwind
- Backend: Firebase
- AI: Google Genkit + Gemini 2.0 Flash
- Search: Tavily AI Search API

## Deployment
This project is hosted on Firebase: [Live Site](https://falseguard.web.app)

## To Run Locally
1. Clone the repo
2. `npm install`
3. Set up your Search API Key (see below)
4. `npm run dev`

## Real-Time Web Search Setup (Tavily API)

This project uses the [Tavily Search API](https://tavily.com/) to find real-time supporting articles from the web.

1.  **Get a free API Key:** Go to [tavily.com](https://tavily.com/) and sign up for a free account to get your API key.
2.  **Set the API Key:** Create a file named `.env` in the root of the project (if it doesn't exist) and add your key like this:

    ```
    TAVILY_API_KEY=your_api_key_here
    ```
The app will now use live web search results for its analysis.

## Firebase Setup
- firebase.json and .firebaserc are included
- You can deploy using `firebase deploy`
