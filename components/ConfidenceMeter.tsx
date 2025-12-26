import React from 'react';

interface ConfidenceMeterProps {
  score: number;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score }) => {
  // Determine color based on score
  let barColor = 'bg-gray-400';
  if (score >= 90) barColor = 'bg-green-500';
  else if (score >= 60) barColor = 'bg-yellow-500';
  else if (score > 30) barColor = 'bg-orange-500';
  else barColor = 'bg-red-500';

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Confidence Score</span>
        <span className="text-2xl font-bold text-gray-900">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${barColor}`} 
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-400">
        <span>Unverified</span>
        <span>Possible</span>
        <span>Verified</span>
      </div>
    </div>
  );
};

export default ConfidenceMeter;
