import React from 'react';
import { AiAnalysis, Player } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface AnalysisPanelProps {
  analysis: AiAnalysis | null;
  isThinking: boolean;
  turn: Player;
  moveCount: number;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isThinking, turn, moveCount }) => {
  
  // Prepare data for a simple win-rate gauge visualization
  const winRateData = [
    { name: 'Win Rate', value: analysis ? analysis.winRate : 0 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Neural Engine Analysis
      </h2>

      {/* Status Indicator */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm font-medium">Engine Status</span>
          {isThinking ? (
            <span className="flex items-center text-amber-600 text-sm font-bold animate-pulse">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              Thinking...
            </span>
          ) : (
            <span className="flex items-center text-emerald-600 text-sm font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              Idle
            </span>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full transition-all duration-1000 ${isThinking ? 'bg-amber-500 w-full animate-pulse' : 'bg-emerald-500 w-0'}`}
          ></div>
        </div>
      </div>

      {/* Reasoning Box */}
      <div className="flex-1 mb-6 overflow-y-auto min-h-[150px]">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Strategy Log</h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-700 leading-relaxed">
          {analysis ? (
            <p>{analysis.reasoning}</p>
          ) : (
            <p className="text-gray-400 italic">Waiting for analysis...</p>
          )}
        </div>
      </div>

      {/* Win Rate Viz */}
      <div className="h-48 w-full">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Win Probability (AI)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={winRateData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" domain={[-1, 1]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  return (
                    <div className="bg-gray-800 text-white text-xs p-2 rounded">
                      {(val * 100).toFixed(1)}%
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#666" />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {winRateData.map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Losing (-1.0)</span>
          <span>Balanced (0.0)</span>
          <span>Winning (1.0)</span>
        </div>
      </div>
      
      {/* Game Info */}
      <div className="mt-6 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400">Turn</p>
          <p className="font-bold text-gray-800">{turn === Player.Black ? 'Black (You)' : 'White (AI)'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Moves</p>
          <p className="font-bold text-gray-800">{moveCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;