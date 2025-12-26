import React from 'react';
import { ShieldCheck, Info, HelpCircle } from 'lucide-react';
import { TRUSTED_DOMAINS } from '../constants';

interface HeaderProps {
    onReset: () => void;
    onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, onAboutClick }) => {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
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
                        onClick={onAboutClick}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <HelpCircle size={18} />
                        <span className="hidden sm:inline">About</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
