import React from 'react';
import { FactCheckResult } from '../types';
import { VERDICT_CONFIG } from '../constants';
import ConfidenceMeter from './ConfidenceMeter';
import { AlertTriangle, ShieldCheck, XCircle, HelpCircle, Clock, ListChecks } from 'lucide-react';

interface VerdictCardProps {
  result: FactCheckResult;
}

const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  const config = VERDICT_CONFIG[result.verdict];
  
  const renderIcon = () => {
    // Responsive icon sizes: w-10 h-10 on mobile, w-12 h-12 on desktop
    const iconClass = "w-10 h-10 sm:w-12 sm:h-12";
    switch (result.verdict) {
      case 'VERIFIED': return <ShieldCheck className={iconClass} />;
      case 'FALSE': return <XCircle className={iconClass} />;
      case 'MISLEADING': return <AlertTriangle className={iconClass} />;
      default: return <HelpCircle className={iconClass} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Banner */}
      <div className={`p-5 sm:p-6 border-b flex items-start gap-4 sm:gap-5 ${config.color}`}>
        <div className={`mt-1 flex-shrink-0 ${config.iconColor}`}>
            {renderIcon()}
        </div>
        <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">{config.label}</h2>
                {result.isDeveloping && (
                    <div className="self-start flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full text-[10px] sm:text-xs font-bold text-gray-700 border border-gray-200 shadow-sm animate-pulse">
                        <Clock size={12} />
                        Developing Story
                    </div>
                )}
            </div>
            <p className="mt-1 font-medium opacity-90 text-sm sm:text-base">{config.description}</p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-8">
        <div className="prose prose-blue max-w-none mb-8">
          <h3 className="text-gray-900 font-serif text-lg sm:text-xl mb-3">Analysis</h3>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            {result.summary}
          </p>
        </div>

        {/* Key Facts Section */}
        {result.keyFacts && result.keyFacts.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-5 sm:p-6 border border-slate-100 mb-8">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ListChecks size={16} />
              Key Takeaways
            </h4>
            <ul className="space-y-2">
              {result.keyFacts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700 text-sm sm:text-base">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span className="leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ConfidenceMeter score={result.confidenceScore} />
      </div>
    </div>
  );
};

export default VerdictCard;