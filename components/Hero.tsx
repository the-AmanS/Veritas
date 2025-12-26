import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface HeroProps {
    query: string;
    setQuery: (query: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    loading: boolean;
}

const Hero: React.FC<HeroProps> = ({ query, setQuery, handleSearch, loading }) => {
    return (
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
    );
};

export default Hero;
