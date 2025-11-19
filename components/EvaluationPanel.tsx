import React from 'react';
import { BenchmarkResult, BotType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface EvaluationPanelProps {
  results: BenchmarkResult[];
  isRunning: boolean;
  totalGames: number;
  geminiWins: number;
}

const EvaluationPanel: React.FC<EvaluationPanelProps> = ({ results, isRunning, totalGames, geminiWins }) => {
  const winRate = totalGames > 0 ? ((geminiWins / totalGames) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Evaluation & Benchmark
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <p className="text-xs text-purple-600 font-semibold uppercase">Gemini Win Rate</p>
          <p className="text-3xl font-bold text-purple-800">{winRate}%</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-xs text-gray-600 font-semibold uppercase">Games Played</p>
          <p className="text-3xl font-bold text-gray-800">{totalGames}</p>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm font-medium">Benchmark Status</span>
          {isRunning ? (
            <span className="flex items-center text-purple-600 text-sm font-bold animate-pulse">
              Running Evaluation Loop...
            </span>
          ) : (
            <span className="flex items-center text-gray-500 text-sm font-bold">
              Paused
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[200px] w-full">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Learning Curve (Win Rate %)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={results}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="gameId" 
              tick={{fontSize: 10}} 
              tickLine={false}
              axisLine={false}
              label={{ value: 'Games', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{fontSize: 10}} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="winRateMovingAvg" 
              stroke="#8884d8" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 6 }} 
              name="Win Rate %"
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Evaluating Gemini-2.5-Flash vs Heuristic Baseline
      </div>
    </div>
  );
};

export default EvaluationPanel;
