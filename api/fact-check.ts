import type { VercelRequest, VercelResponse } from '@vercel/node';

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

interface Source {
    title: string;
    url: string;
    domain: string;
    sentiment: 'SUPPORT' | 'DISPUTE' | 'NEUTRAL';
}

interface FactCheckResult {
    verdict: 'VERIFIED' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
    confidenceScore: number;
    summary: string;
    keyFacts: string[];
    isDeveloping: boolean;
    logicExplanation: string;
    sources: Source[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { claim } = req.body;
    if (!claim || typeof claim !== 'string' || claim.trim().length < 5) {
        return res.status(400).json({ error: 'Invalid claim' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
    }

    const prompt = `You are Veritas, a strict and neutral real-time fact-checking agent.

Your task is to verify this claim: "${claim.trim()}"

Based on your knowledge, analyze whether this claim is true, false, misleading, or unverified.

You MUST respond with ONLY a valid JSON object:
{
  "verdict": "VERIFIED" or "FALSE" or "MISLEADING" or "UNVERIFIED",
  "confidenceScore": number between 0-100,
  "summary": "A 2-sentence clear explanation.",
  "keyFacts": ["Fact 1", "Fact 2"],
  "isDeveloping": false,
  "logicExplanation": "Short phrase",
  "sources": [{"title": "...", "url": "...", "domain": "...", "sentiment": "SUPPORT"}]
}`;

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

        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) text = text.substring(start, end + 1);

        let data: FactCheckResult;
        try {
            data = JSON.parse(text);
        } catch {
            return res.json({
                verdict: 'UNVERIFIED', confidenceScore: 0,
                summary: 'Error parsing AI response.',
                keyFacts: [], isDeveloping: false,
                logicExplanation: 'Parse Error', sources: []
            });
        }

        data.sources = (data.sources || []).filter((source: Source) =>
            TRUSTED_DOMAINS.some(trusted =>
                source.url?.toLowerCase().includes(trusted) ||
                source.domain?.toLowerCase().includes(trusted)
            )
        );

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
