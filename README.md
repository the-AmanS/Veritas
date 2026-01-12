# Veritas - Real-Time Fact Check Agent 🛡️

Veritas is a high-precision, real-time fact-checking agent designed to combat misinformation. It leverages a **RAG (Retrieval-Augmented Generation)** inspired architecture to cross-reference claims against a strict whitelist of 40+ trusted global news agencies.

Powered by **Groq** (Llama 3 70b) for ultra-low latency analysis, Veritas categorizes claims with granular verdicts and provides transparent source citations.

![Veritas Demo](./public/vite.svg)

## 🚀 Key Features

-   **Real-Time Verification**: Instant analysis of news headlines and claims.
-   **Trusted Source Whitelist**: Citations are strictly limited to verified outlets like *Reuters, AP, Bloomberg, BBC, NPR*, etc., preventing hallucinated or low-quality sources.
-   **Granular Verdicts**: Claims are classified as:
    -   ✅ **Verified**: 100% supported by evidence.
    -   ❌ **False**: Explicitly debunked.
    -   ⚠️ **Misleading**: Context is missing or details are wrong.
    -   ❓ **Unverified**: No sufficient trusted evidence found.
-   **Transparent Logic**: Every verdict includes a logic explanation and a list of sources with sentiment analysis (Support/Dispute/Neutral).

## 🛠️ Tech Stack

### Frontend
-   **React** (v19) + **Vite**
-   **TypeScript**
-   **Tailwind CSS** (Styling)
-   **Lucide React** (Icons)

### Backend
-   **Node.js** + **Express**
-   **Groq SDK** (AI Inference)
-   **Dotenv**

## ⚡ Quick Start

### Prerequisites
-   Node.js (v18+)
-   A [Groq API Key](https://console.groq.com/)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/veritas.git
    cd veritas
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory (see `.env.example`):
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

4.  **Run the Application**
    Start both the backend API and frontend dev server concurrently:
    ```bash
    npm run dev:full
    ```
    -   Frontend: `http://localhost:3000`
    -   Backend: `http://localhost:3001`

## 📡 API Documentation

### `POST /api/fact-check`

Analyzes a text claim and returns a structured verification object.

**Request Body:**
```json
{
  "claim": "Aliens have officially landed in New York City."
}
```

**Response:**
```json
{
  "verdict": "FALSE",
  "confidenceScore": 98,
  "summary": "No credible news outlets have reported this event.",
  "keyFacts": ["NYPD confirms no alien activity.", "NASA radar shows no anomalies."],
  "isDeveloping": false,
  "logicExplanation": "No Evidence Found",
  "sources": []
}
```

## 🛡️ Trusted Sources Architecture

Veritas enforces a strict "allowlist" policy. The AI model is instructed to strictly reference domains from our curated list of high-integrity journalism, including:
-   **Wires**: Reuters, AP, AFP
-   **US**: NYT, WaPo, WSJ, NPR
-   **UK/EU**: BBC, Guardian, DW, France24
-   **Asia**: Nikkei, CNA, The Hindu

