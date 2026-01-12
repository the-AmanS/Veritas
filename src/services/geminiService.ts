import { FactCheckResult } from '../types';

export const checkClaim = async (claim: string): Promise<FactCheckResult> => {
  const response = await fetch('/api/fact-check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ claim }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Unable to verify claim at this time. Please try again.');
  }

  return response.json();
};