import React, { useEffect, useRef } from 'react';
import { TrainingState, BotType } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TrainingDashboardProps {
  state: TrainingState;
  toggleHeadless: () => void;
  toggleTraining: () => void;
  opponent: BotType;
  setOpponent: (bot: BotType) => void;
}

const TrainingDashboard: React.FC<TrainingDashboardProps> = ({ 
  state, 
  toggleHeadless, 
  toggleTraining, 
  opponent, 
  setOpponent 
}) => {
  
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [state.logs]);

  // Prepare chart data
  // We just take the checkpoints for the graph to keep it clean
  const chartData = state.checkpoints.map(cp => ({
    iteration: cp.iteration,
    loss: (1 - cp.winRate).toFixed(2),
    winRate: (cp.winRate * 100).toFixed(1)
  }));

  return (
    <div className="w-full bg-slate-900 text-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] border border-slate-700">
      
      {/* Left: Controls & Terminal */}
      <div className="w-full md:w-1/2 flex flex-col p-6 border-r border-slate-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
            Auto-Training Pipeline
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            Running: {state.isRunning ? 'ACTIVE' : 'PAUSED'} | Headless: {state.isHeadless ? 'ON' : 'OFF'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 p-3 rounded border border-slate-600">
            <div className="text-xs text-slate-400 uppercase">Iterations</div>
            <div className="text-xl font-bold text-white">{state.currentIteration}</div>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-600">
            <div className="text-xs text-slate-400 uppercase">Win Rate</div>
            <div className="text-xl font-bold text-green-400">
              {state.totalGames > 0 ? ((state.geminiWins / state.totalGames) * 100).toFixed(1) : '0.0'}%
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded border border-slate-600">
             <div className="text-xs text-slate-400 uppercase">Loss</div>
             <div className="text-xl font-bold text-red-400">{state.loss.toFixed(3)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={toggleTraining}
            className={`py-3 px-4 rounded font-bold text-sm transition-colors ${
              state.isRunning 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {state.isRunning ? 'STOP PIPELINE (Ctrl+C)' : 'RUN TRAIN.PY'}
          </button>
          
          <div className="flex gap-2">
             <button
                onClick={toggleHeadless}
                className={`flex-1 py-3 px-2 rounded font-medium text-xs border transition-colors ${
                  state.isHeadless 
                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                    : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Headless Mode
              </button>
              <select 
                className="bg-slate-800 text-white text-xs rounded border border-slate-600 px-2"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value as BotType)}
                disabled={state.isRunning}
              >
                <option value={BotType.Greedy}>vs Greedy</option>
                <option value={BotType.Random}>vs Random</option>
              </select>
          </div>
        </div>

        {/* Terminal Log */}
        <div 
          ref={terminalRef}
          className="flex-1 bg-black rounded border border-slate-700 p-4 font-mono text-xs overflow-y-auto shadow-inner"
        >
          <div className="text-slate-500 mb-2">root@gemini-server:~/gomoku-zero$ python train.py</div>
          {state.logs.map((log, idx) => (
            <div key={idx} className="mb-1">
              <span className="text-slate-600">[{log.timestamp}]</span>{' '}
              <span className={`${
                log.type === 'success' ? 'text-green-400' : 
                log.type === 'warning' ? 'text-yellow-400' : 'text-slate-300'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
          {state.isRunning && (
            <div className="text-green-500 animate-pulse mt-2">_</div>
          )}
        </div>
      </div>

      {/* Right: Visualizations */}
      <div className="w-full md:w-1/2 bg-slate-800 p-6 flex flex-col">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Training Loss & Win Rate</h3>
        
        {/* Graph 1: Win Rate */}
        <div className="h-1/2 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="iteration" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => `Iter ${val}`} />
              <YAxis stroke="#9ca3af" fontSize={10} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#10b981' }}
              />
              <Area type="monotone" dataKey="winRate" stroke="#10b981" fillOpacity={1} fill="url(#colorWin)" name="Win Rate %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Graph 2: Loss */}
        <div className="h-1/2 w-full relative">
            <div className="absolute top-0 right-0 text-xs text-slate-500">Optimizing...</div>
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="iteration" stroke="#9ca3af" fontSize={10} />
              <YAxis stroke="#9ca3af" fontSize={10} domain={[0, 1]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#f87171' }}
              />
              <Line type="monotone" dataKey="loss" stroke="#f87171" strokeWidth={2} dot={false} name="Loss (1 - WR)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;