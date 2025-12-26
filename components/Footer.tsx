import React from 'react';

interface FooterProps {
    onLegalClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalClick }) => {
    return (
        <footer className="py-6 text-center text-sm text-gray-400 border-t border-gray-200 bg-white/50 px-4">
            <div className="flex flex-col items-center gap-2">
                <p>© 2025 Veritas Project • Educational Project</p>
                <p className="text-xs sm:text-sm">
                    Made with ❤️ by <a href="https://www.instagram.com/amman._11/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Aman Singh</a> with ☕
                </p>
                <button
                    onClick={onLegalClick}
                    className="text-blue-600 hover:underline decoration-dotted font-medium text-xs sm:text-sm"
                >
                    Disclaimer, AI Limitations & Fair Use Policy
                </button>
            </div>
        </footer>
    );
};

export default Footer;
