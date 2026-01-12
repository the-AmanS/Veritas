import React from 'react';

interface ErrorDisplayProps {
    error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center mb-8 animate-in fade-in slide-in-from-top-2">
            <span className="font-semibold block mb-1">Error</span>
            {error}
        </div>
    );
};

export default ErrorDisplay;
