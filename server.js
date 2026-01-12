import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TRUSTED_DOMAINS = [
    'reuters.com', 'apnews.com', 'bloomberg.com', 'cnn.com', 'nytimes.com',
    'washingtonpost.com', 'wsj.com', 'npr.org', 'pbs.org', 'usatoday.com',
    'bbc.com', 'theguardian.com', 'independent.co.uk', 'sky.com', 'dw.com',
    'france24.com', 'euronews.com', 'aljazeera.com', 'thehindu.com',
    'indianexpress.com', 'ndtv.com', 'pti.in', 'timesofindia.indiatimes.com',
    'hindustantimes.com', 'livemint.com', 'nikkei.com', 'kyodonews.net',
    'scmp.com', 'channelnewsasia.com', 'straitstimes.com', 'cbc.ca',
    'theglobeandmail.com', 'abc.net.au', 'smh.com.au', 'snopes.com',
    'politifact.com', 'factcheck.org'
];

app.post('/api/fact-check', async (req, res) => {
    const { claim } = req.body;

    if (!claim || claim.trim().length < 5) {
        return res.status(400).json({ error: 'Invalid claim' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY not configured in .env' });
    }

    const prompt = `You are Veritas, a strict and neutral real-time fact-checking agent.

Your task is to verify this claim: "${claim.trim()}"

Based on your knowledge, analyze whether this claim is true, false, misleading, or unverified.

**Trusted Sources to Reference (if applicable):** ${TRUSTED_DOMAINS.slice(0, 15).join(', ')}

You MUST respond with ONLY a valid JSON object (no markdown, no explanation outside JSON):
{
  "verdict": "VERIFIED" or "FALSE" or "MISLEADING" or "UNVERIFIED",
  "confidenceScore": number between 0-100,
  "summary": "A 2-sentence clear explanation of the verdict.",
  "keyFacts": ["Fact 1", "Fact 2", "Fact 3"],
  "isDeveloping": false,
  "logicExplanation": "Short phrase like 'Multiple Sources Confirm' or 'No Evidence Found'",
  "sources": [
    {
      "title": "Article or source title",
      "url": "https://example.com/article",
      "domain": "example.com",
      "sentiment": "SUPPORT" or "DISPUTE" or "NEUTRAL"
    }
  ]
}

Important: Only return the JSON object, nothing else.`;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a fact-checking AI that responds only with valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1024,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API error:', errorText);
            return res.status(500).json({ error: 'Failed to verify claim' });
        }

        const result = await response.json();
        let text = result.choices?.[0]?.message?.content || '';

        // Clean JSON
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error('Failed to parse:', text);
            return res.json({
                verdict: 'UNVERIFIED',
                confidenceScore: 0,
                summary: 'Error parsing AI response.',
                keyFacts: [],
                isDeveloping: false,
                logicExplanation: 'Parse Error',
                sources: []
            });
        }

        // Filter sources to trusted domains
        data.sources = (data.sources || []).filter(source =>
            TRUSTED_DOMAINS.some(trusted =>
                source.url?.toLowerCase().includes(trusted) ||
                source.domain?.toLowerCase().includes(trusted)
            )
        );

        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Backend API running at http://localhost:${PORT}`);
    console.log(`   POST /api/fact-check (using Groq API)`);
});
