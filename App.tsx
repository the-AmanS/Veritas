import React, { useState } from 'react';
import { Search, Loader2, ShieldCheck, Info, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { checkClaim } from './services/geminiService';
import { FactCheckResult } from './types';
import VerdictCard from './components/VerdictCard';
import SourceList from './components/SourceList';
import AboutModal from './components/AboutModal';
import LegalModal from './components/LegalModal';
import { TRUSTED_DOMAINS } from './constants';

function App() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<FactCheckResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [showAllDomains, setShowAllDomains] = useState(false);

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

    const displayedDomains = showAllDomains ? TRUSTED_DOMAINS : TRUSTED_DOMAINS.slice(0, 15);

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 font-sans flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setResult(null); setQuery(''); }}>
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-none">Veritas</h1>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Real-Time Fact Check Agent</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Trusted Sources Tooltip/Indicator - Hidden on mobile */}
                        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <Info size={14} />
                            <span>Powered by {TRUSTED_DOMAINS.length} trusted global sources</span>
                        </div>

                        {/* About Button */}
                        <button
                            onClick={() => setIsAboutOpen(true)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <HelpCircle size={18} />
                            <span className="hidden sm:inline">About</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 mt-8 sm:mt-12 flex-grow w-full">
                {/* Hero & Input */}
                <div className="text-center mb-8 sm:mb-10">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                        Verify news in real-time.
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed px-2">
                        Uses RAG architecture to cross-reference claims against a whitelist of trusted global news agencies.
                    </p>

                    <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto shadow-lg rounded-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Paste a headline (e.g., 'Aliens landed in NY')..."
                                className="w-full px-5 py-3 sm:px-6 sm:py-4 pr-16 sm:pr-32 text-base sm:text-lg rounded-2xl border-2 border-transparent bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400"
                                disabled={loading}
                            />
                            <div className="absolute right-2 top-2 bottom-2">
                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="h-full px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                                    <span className="hidden sm:inline">Verify</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                        <span>Try:</span>
                        <button onClick={() => setQuery("The Eiffel Tower caught fire yesterday")} className="hover:text-blue-600 hover:underline">
                            "Eiffel Tower fire"
                        </button>
                        <span className="hidden sm:inline">•</span>
                        <button onClick={() => setQuery("Actor Tom Hanks is currently hospitalized")} className="hover:text-blue-600 hover:underline">
                            "Tom Hanks hospitalized"
                        </button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center mb-8 animate-in fade-in slide-in-from-top-2">
                        <span className="font-semibold block mb-1">Error</span>
                        {error}
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        <VerdictCard result={result} />
                        <SourceList sources={result.sources} logicExplanation={result.logicExplanation} />
                    </div>
                )}

                {!result && !loading && !error && (
                    <div className="mt-16 sm:mt-20 border-t border-gray-200 pt-10 pb-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Trusted Sources Whitelist</h3>
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4">
                            {displayedDomains.map(domain => (
                                <span key={domain} className="px-2 sm:px-3 py-1 bg-white border border-gray-200 rounded-full text-[10px] sm:text-xs text-gray-500">
                                    {domain}
                                </span>
                            ))}
                            {!showAllDomains && (
                                <button
                                    onClick={() => setShowAllDomains(true)}
                                    className="px-2 sm:px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] sm:text-xs text-blue-600 font-medium hover:bg-blue-100 transition-colors flex items-center gap-1"
                                >
                                    +{TRUSTED_DOMAINS.length - 15} more
                                </button>
                            )}
                        </div>

                        {showAllDomains && (
                            <div className="text-center">
                                <button
                                    onClick={() => setShowAllDomains(false)}
                                    className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                                >
                                    <ChevronUp size={14} />
                                    Show less
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer with Legal Links */}
            <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-200 bg-white/50 px-4">
                <div className="flex flex-col items-center gap-2">
                    <p>© 2025 Veritas Project • Educational Project</p>
                    <p className="text-xs sm:text-sm">
                        Made with ❤️ by <a href="https://www.instagram.com/amman._11/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Aman Singh</a> with ☕
                    </p>
                    <button
                        onClick={() => setIsLegalOpen(true)}
                        className="text-blue-600 hover:underline decoration-dotted font-medium text-xs sm:text-sm"
                    >
                        Disclaimer, AI Limitations & Fair Use Policy
                    </button>
                </div>
            </footer>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
            <LegalModal isOpen={isLegalOpen} onClose={() => setIsLegalOpen(false)} />
        </div>
    );
}

export default App;