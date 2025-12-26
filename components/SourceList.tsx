import React from 'react';
import { Source } from '../types';
import { CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface SourceListProps {
  sources: Source[];
  logicExplanation: string;
}

const SourceList: React.FC<SourceListProps> = ({ sources, logicExplanation }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">Source Agreement</h3>
      <p className="text-sm text-gray-600 mb-4 italic">"{logicExplanation}"</p>
      
      <div className="space-y-3">
        {sources.map((source, index) => {
          return (
            <div 
              key={index}
              className="block p-4 rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded whitespace-nowrap">
                      {source.domain}
                    </span>
                    {source.sentiment === 'SUPPORT' && (
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100 whitespace-nowrap">
                        <CheckCircle size={12} /> Confirms
                      </span>
                    )}
                    {source.sentiment === 'DISPUTE' && (
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100 whitespace-nowrap">
                        <XCircle size={12} /> Disputes
                      </span>
                    )}
                    {source.sentiment === 'NEUTRAL' && (
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 whitespace-nowrap">
                        <MinusCircle size={12} /> Neutral
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-sm sm:text-base font-medium text-gray-900 leading-tight mb-2">
                    {source.title}
                  </h4>

                  {/* Domain & URL Text */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{source.domain}</span>
                    {source.url && (
                        <>
                            <span>•</span>
                            <span className="truncate max-w-[200px] text-gray-400">{source.url}</span>
                        </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourceList;