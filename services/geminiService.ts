import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { TRUSTED_DOMAINS } from "../constants";
import { FactCheckResult, VerdictType } from "../types";

// Define the response schema strictly using SchemaType
const factCheckSchema = {
  type: SchemaType.OBJECT,
  properties: {
    verdict: {
      type: SchemaType.STRING,
      enum: [
        VerdictType.VERIFIED,
        VerdictType.FALSE,
        VerdictType.MISLEADING,
        VerdictType.UNVERIFIED
      ],
      description: "The final verdict. VERIFIED = Event confirmed by trusted sources. FALSE = Event debunked by trusted sources (called fake/hoax). UNVERIFIED = No mention in trusted sources."
    },
    confidenceScore: {
      type: SchemaType.NUMBER,
      description: "A score from 0 to 100. 100% means we are certain of the verdict (whether it is True OR False). 0% means no info found."
    },
    summary: {
      type: SchemaType.STRING,
      description: "A concise, natural language explanation. If False, explain that trusted sources have debunked it. If Unverified, state that no trusted sources reported it."
    },
    keyFacts: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "A list of 3-5 simple, factual bullet points. E.g. 'Reuters confirms this is false', 'Video is from 2023'."
    },
    isDeveloping: {
      type: SchemaType.BOOLEAN,
      description: "True if the story appears to be breaking news (last 24h) with limited verification."
    },
    logicExplanation: {
      type: SchemaType.STRING,
      description: "A short phrase summarizing source agreement, e.g., 'All Sources Dispute Claim', 'Reuters & AP Confirm'."
    },
    sources: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          url: { type: SchemaType.STRING },
          domain: { type: SchemaType.STRING },
          sentiment: {
            type: SchemaType.STRING,
            enum: ['SUPPORT', 'DISPUTE', 'NEUTRAL'],
            description: "CRITICAL: 'SUPPORT' means the source says the claim is TRUE. 'DISPUTE' means the source says the claim is FALSE/FAKE."
          }
        },
        required: ["title", "url", "domain", "sentiment"]
      }
    }
  },
  required: ["verdict", "confidenceScore", "summary", "keyFacts", "isDeveloping", "sources", "logicExplanation"]
};

// Define the schema types for the fallback mechanism
export const checkClaim = async (claim: string): Promise<FactCheckResult> => {
  const apiKey = process.env.API_KEY; // Managed by Vite
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Construct the One-Shot Prompt
  const prompt = `
    You are Veritas, a strict and neutral real-time fact-checking agent.
    
    Your task is to verify this claim: "${claim}"
    
    Analyze the claim using your tools (Google Search) to find the truth.
    
    **STRICT Trusted Whitelist (ONLY these domains are allowed):**
    ${TRUSTED_DOMAINS.join(', ')}
    
    **AGGRESSIVE FILTERING:**
    - If a source is NOT on the whitelist, IGNORE it.
    - If NO sources from the whitelist are found, Verdict is UNVERIFIED.
    
    Based on the evidence found, you must output a FINAL RESPONSE in strict JSON format.
    
    Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON object.
    
    Follow this exact JSON schema:
    {
      "verdict": "VERIFIED" | "FALSE" | "MISLEADING" | "UNVERIFIED",
      "confidenceScore": number (0-100),
      "summary": "A 2-sentence clear explanation.",
      "keyFacts": ["Fact 1", "Fact 2"],
      "isDeveloping": boolean,
      "logicExplanation": "Short logic summary",
      "sources": [
        {
          "title": "Source Title",
          "url": "https://source.url",
          "domain": "source.com",
          "sentiment": "SUPPORT" | "DISPUTE" | "NEUTRAL"
        }
      ]
    }
  `;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} } as any]
      // CRITICAL: Do NOT put responseMimeType here when using tools!
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // CLEANING LOGIC (Important!)
    // Find the first '{' and the last '}' to extract the JSON object
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    } else {
      // Fallback: Try cleaning markdown if braces aren't found (unlikely for valid JSON)
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    try {
      const data = JSON.parse(text) as FactCheckResult;

      // ---------------------------------------------------------
      // STRICT ENFORCEMENT PROTOCOL (User Request id: 89)
      // ---------------------------------------------------------
      // Programmatically filter sources to ONLY allow those in the TRUSTED_DOMAINS constant.
      // This is a safety net in case the AI hallucinates a non-trusted source.

      const originalSourceCount = data.sources.length;

      data.sources = data.sources.filter(source => {
        const urlLower = source.url.toLowerCase();
        const domainLower = source.domain.toLowerCase();

        // Check if the source matches any trusted domain
        return TRUSTED_DOMAINS.some(trusted =>
          urlLower.includes(trusted.toLowerCase()) ||
          domainLower.includes(trusted.toLowerCase())
        );
      });

      // If sources were filtered out and none remain, force UNVERIFIED
      if (data.sources.length === 0 && originalSourceCount > 0) {
        console.warn("Non-trusted sources were removed. Defaulting to UNVERIFIED.");
        data.verdict = VerdictType.UNVERIFIED;
        data.confidenceScore = 0;
        data.summary = "Sources found did not match our strict trusted whitelist. Therefore, this claim remains unverified by our standards.";
        data.isDeveloping = false;
        data.keyFacts = ["Use of non-whitelisted sources detected and filtered.", "No trusted global reports found."];
      }

      return data;

    } catch (parseError) {
      console.error("Failed to parse JSON:", text);
      // Fallback/Error object matching FactCheckResult interface
      return {
        verdict: VerdictType.UNVERIFIED,
        confidenceScore: 0,
        summary: "Error parsing the AI response. Please try again.",
        keyFacts: ["The AI response could not be processed as valid JSON."],
        isDeveloping: false,
        logicExplanation: "Internal Error",
        sources: []
      };
    }

  } catch (error: any) {
    console.error("Fact check failed:", error);

    const errorMessage = error.toString().toLowerCase() || error.message?.toLowerCase() || "";

    if (errorMessage.includes("api key") || errorMessage.includes("403") || errorMessage.includes("not found")) {
      throw new Error("Invalid API Key or Service not enabled. Please check your Google AI Studio key.");
    }

    if (errorMessage.includes("503") || errorMessage.includes("overloaded")) {
      throw new Error("The service is currently overloaded. Please try again in a moment.");
    }

    if (errorMessage.includes("safety") || errorMessage.includes("blocked")) {
      throw new Error("The claim could not be processed due to safety guidelines.");
    }

    throw error instanceof Error ? error : new Error("An unexpected error occurred during verification.");
  }
};