# 🛡️ FalseGuard – AI-Powered Fake News Detection Tool

**FalseGuard** is an AI-powered web application designed to help users detect and understand misleading or potentially fake news in real-time. It supports both text input and file uploads (PDFs & images), with advanced reasoning, evidence sourcing, and a polished dark mode UI.

---

## 🚀 Features

### 📰 Article Analysis
- Paste any news article or headline.
- Classifies content as **Real** or **Fake**.
- Provides **explanations** for its decision.
- Uses **Tavily Search API** to search the web and gather **real-time supporting links** for fact-checking.

### 📄 PDF/Image Analysis
- Upload PDFs or images (e.g., screenshots of posts).
- Detects misinformation or content manipulation.
- Ask questions like:
  - *"Summarize this document."*
  - *"Is this logo authentic?"*

### 🧠 AI Technology
- Powered by **CNN and AI connected to CNN** for classification, reasoning, and content analysis.
- Real-time evidence sourcing via Tavily search integration.

### 🎨 UI/UX
- Built with **Next.js (App Router)**, **React**, and **TypeScript**
- Styled with **ShadCN UI** and **Tailwind CSS**
- Fully responsive with support for **dark mode**

---

## ⚙️ Tech Stack

| Area        | Tools & Frameworks                                  |
|-------------|------------------------------------------------------|
| Frontend    | Next.js, React, TypeScript, Tailwind CSS, ShadCN UI |
| Backend     | AI Integration (CNN), Tavily Search API             |
| File Support| PDF/Image upload & analysis                         |
| Utilities   | Error Handling, Realtime Search, Dark Mode          |

---

## 🛠️ How to Run Locally

```bash
# Clone the repo
git clone https://github.com/Atlasdestroyer859/falseguard.git
cd falseguard

# Install dependencies
npm install

# Start the development server
npm run dev
