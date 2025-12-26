# Veritas - Real-Time Fact Check Agent

Veritas is a real-time AI fact-checking agent built with React, Vite, and Google Gemini. It verifies claims against a strict whitelist of trusted global sources to combat misinformation.

## 🚀 Features

- **Real-Time Verification**: Instantly analyzes claims using Google's Gemini AI.
- **Strict Whitelisting**: Only parses content from trusted global sources (e.g., Reuters, AP, BBC) to ensure accuracy.
- **Sentiment Analysis**: Classifies source coverage as Supporting, Disputing, or Neutral.
- **Transparent Verdicts**: Provides clear "Verified", "False", or "Unverified" status with confidence scores.
- **Citation-Based**: Lists all sources used to reach a conclusion.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/the-AmanS/Veritas.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🛡️ Trusted Sources
Veritas relies on a curated list of domains including Reuters, AP News, BBC, Bloomberg, and other highly credible outlets.

---
Made with ❤️ by [Aman Singh](https://www.instagram.com/amman._11/) with ☕
