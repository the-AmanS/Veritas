import { VerdictType } from './types';

export const TRUSTED_DOMAINS = [
  // Global Wires & US
  'reuters.com',
  'apnews.com',
  'bloomberg.com',
  'cnn.com',
  'nytimes.com',
  'washingtonpost.com',
  'wsj.com',
  'npr.org',
  'pbs.org',
  'usatoday.com',
  
  // UK & Europe
  'bbc.com',
  'theguardian.com',
  'independent.co.uk',
  'sky.com', // Sky News
  'dw.com', // Deutsche Welle (Germany)
  'france24.com', // France
  'euronews.com',
  
  // Asia
  'aljazeera.com', // Middle East
  'thehindu.com', // India
  'indianexpress.com', // India
  'ndtv.com', // India
  'pti.in', // India (Press Trust of India)
  'timesofindia.indiatimes.com', // India
  'hindustantimes.com', // India
  'livemint.com', // India
  'nikkei.com', // Japan
  'kyodonews.net', // Japan
  'scmp.com', // South China Morning Post
  'channelnewsasia.com', // Singapore
  'straitstimes.com', // Singapore
  
  // Americas (Non-US) & Australia
  'cbc.ca', // Canada
  'theglobeandmail.com', // Canada
  'abc.net.au', // Australia
  'smh.com.au', // Sydney Morning Herald
  
  // Fact Checking Organizations
  'snopes.com',
  'politifact.com',
  'factcheck.org'
];

export const VERDICT_CONFIG = {
  [VerdictType.VERIFIED]: {
    color: 'bg-green-100 text-green-800 border-green-200',
    iconColor: 'text-green-600',
    label: 'Verified',
    description: '100% supported by evidence from trusted sources.'
  },
  [VerdictType.FALSE]: {
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600',
    label: 'False',
    description: 'Explicitly debunked by trusted sources.'
  },
  [VerdictType.MISLEADING]: {
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    iconColor: 'text-orange-600',
    label: 'Misleading',
    description: 'The core event may have happened, but details are wrong or context is missing.'
  },
  [VerdictType.UNVERIFIED]: {
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    iconColor: 'text-slate-600',
    label: 'Unverified',
    description: 'No sufficient evidence found in trusted database. Proceed with caution.'
  }
};