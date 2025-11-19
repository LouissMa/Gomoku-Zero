export enum Player {
  None = 0,
  Black = 1, // Usually the human or first player
  White = 2  // Usually the AI or second player
}

export enum GameStatus {
  Playing,
  Won,
  Draw
}

export enum GameMode {
  HumanVsAI = 'human-vs-ai',
  SelfPlay = 'self-play',
  Training = 'training' // Renamed/Expanded from Benchmark
}

export enum BotType {
  Gemini = 'Gemini AI',
  Greedy = 'Greedy Bot',
  Random = 'Random Bot'
}

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface AiAnalysis {
  reasoning: string;
  winRate: number; // -1 to 1 (from AI perspective)
  suggestedMove: { row: number, col: number };
  candidateMoves?: Array<{row: number, col: number, score: number}>; // For visualization
}

export interface GameState {
  board: number[][];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  history: Move[];
  lastMove: Move | null;
}

export interface BenchmarkResult {
  gameId: number;
  winner: BotType;
  moves: number;
  winRateMovingAvg: number;
}

export interface TrainingLog {
  iteration: number;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export interface Checkpoint {
  id: string;
  iteration: number;
  winRate: number;
  gamesPlayed: number;
  date: string;
}

export interface TrainingState {
  isRunning: boolean;
  isHeadless: boolean;
  currentIteration: number;
  totalGames: number;
  geminiWins: number;
  loss: number; // Simulated Loss (1 - WinRate)
  logs: TrainingLog[];
  checkpoints: Checkpoint[];
}