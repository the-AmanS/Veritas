# Veritas - Real-Time Fact Check Agent


![Veritas Demo](https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop)

### [🔴 Live Demo](https://veritas-ai-eta.vercel.app/)


Veritas is a high-precision, AI-powered fact-checking tool designed to verify news headlines and claims in real-time. Unlike standard AI chatbots that may hallucinate or cite unreliable sources, Veritas enforces a **strict RAG (Retrieval-Augmented Generation) architecture** that only validates claims against a curated whitelist of trusted global news agencies (e.g., Reuters, AP, BBC, Bloomberg).

## 🚀 Key Features

*   **Real-Time API Grounding**: Uses **Google Gemini 2.5 Flash** with integrated Google Search tools to fetch live verified data—no information cutoffs.
*   **Strict Trusted Whitelist**: The core engine programmatically filters out all sources *not* on the `TRUSTED_DOMAINS` list. If a claim is only found on blogs or social media, it returns "Unverified".
*   **Transparent Verdicts**: Delivers clear outcomes:
    *   ✅ **Verified**: Confirmed by multiple trusted sources.
    *   ❌ **False**: Explicitly debunked by trusted sources.
    *   ⚠️ **Misleading**: Context is missing or details are twisted.
    *   ❓ **Unverified**: No credible evidence found.
*   **Source Sentiment Analysis**: Analyzes each article to determine if it *Supports*, *Disputes*, or is *Neutral* regarding the user's claim.
*   **Developing Story Detection**: Automatically flags breaking news where facts may still be evolving.

## 🛠️ Tech Stack

*   **Frontend Framework**: React 19 + TypeScript + Vite
*   **Styling**: Tailwind CSS (Glassmorphism design system)
*   **AI Engine**: Google Gemini API (`gemini-2.5-flash`)
*   **Search**: Google Search Grounding (via Gemini Tools)
*   **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v18 or higher)
*   A Google AI Studio API Key (Gemini)

### 1. Clone the repository
```bash
git clone https://github.com/the-AmanS/Veritas.git
cd Veritas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Get this key from https://aistudio.google.com/
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

## 🧠 How It Works

1.  **User Input**: The user enters a claim (e.g., "The Eiffel Tower is on fire").
2.  **Ambiguity Check**: Client-side logic checks for vague inputs (< 5 chars).
3.  **AI Investigation**:
    *   The app sends the claim to Gemini 2.5 Flash.
    *   Gemini executes a **Google Search** to find relevant articles.
4.  **Strict Filtering**:
    *   The AI is prompted to strictly adhere to the `TRUSTED_DOMAINS` list.
    *   **Post-Processing Safety Use**: The application code *additionally* filters the returned sources. If a source URL does not match the whitelist, it is discarded.
5.  **Verdict Generation**: Based on the *remaining* trusted sources, the AI matches the consensus to a verdict type and generates a confidence score.

## 🔒 Trusted Sources List

Veritas currently supports verifiable cross-referencing from:
*   **Global Wires**: Reuters, AP News, Bloomberg, AFP
*   **US Major**: NY Times, Washington Post, WSJ, NPR, PBS, USA Today, CNN
*   **International**: BBC, The Guardian, DW, France24, Al Jazeera, Nikkei Asia
*   **Fact Checkers**: Snopes, PolitiFact, FactCheck.org
*   *(See `constants.ts` for the full list)*

## ⚠️ Disclaimer

Veritas is an educational project designed to demonstrate the potential of AI in fighting misinformation. While it uses strict sourcing protocols, no AI is infallible. Always verify critical information from primary sources directly.

---
Made with ❤️ by [Aman Singh](https://github.com/the-AmanS)
