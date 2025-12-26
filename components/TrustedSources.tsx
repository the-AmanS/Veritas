import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { TRUSTED_DOMAINS } from '../constants';

const TrustedSources: React.FC = () => {
    const [showAllDomains, setShowAllDomains] = useState(false);
    const displayedDomains = showAllDomains ? TRUSTED_DOMAINS : TRUSTED_DOMAINS.slice(0, 15);

    return (
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
    );
};

export default TrustedSources;
