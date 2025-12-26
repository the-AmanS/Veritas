import React, { useState } from 'react';
import { checkClaim } from './services/geminiService';
import { FactCheckResult } from './types';
import VerdictCard from './components/VerdictCard';
import SourceList from './components/SourceList';
import AboutModal from './components/AboutModal';
import LegalModal from './components/LegalModal';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustedSources from './components/TrustedSources';
import Footer from './components/Footer';
import ErrorDisplay from './components/ErrorDisplay';

function App() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FactCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanQuery = query.trim();

        if (!cleanQuery) return;

        // Client-side ambiguity check
        if (cleanQuery.length < 5) {
            setError("The claim is too short or ambiguous. Please provide more specific details.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await checkClaim(cleanQuery);
            setResult(data);
        } catch (err: any) {
            // Use the specific error message thrown by the service
            setError(err.message || "Unable to verify claim at this time. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setQuery('');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col">
            <Header onReset={handleReset} onAboutClick={() => setIsAboutOpen(true)} />

            <main className="max-w-3xl mx-auto px-4 mt-8 sm:mt-12 flex-grow w-full">
                <Hero
                    query={query}
                    setQuery={setQuery}
                    handleSearch={handleSearch}
                    loading={loading}
                />

                <ErrorDisplay error={error} />

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        <VerdictCard result={result} />
                        <SourceList sources={result.sources} logicExplanation={result.logicExplanation} />
                    </div>
                )}

                {!result && !loading && !error && (
                    <TrustedSources />
                )}
            </main>

            <Footer onLegalClick={() => setIsLegalOpen(true)} />

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
        </div>
    );
}

export default App;