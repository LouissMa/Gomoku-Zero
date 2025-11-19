import { BOARD_SIZE, WIN_STREAK } from "../constants";
import { Player } from "../types";

// Helper to find valid moves
const getValidMoves = (board: number[][]) => {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === Player.None) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
};

// --- RANDOM BOT ---
export const getRandomMove = (board: number[][]) => {
  const moves = getValidMoves(board);
  if (moves.length === 0) return null;
  const randomIdx = Math.floor(Math.random() * moves.length);
  return moves[randomIdx];
};

// --- GREEDY BOT (Heuristic) ---
// Prioritizes: Win > Block Win > Form 4 > Block 4 > Form 3 > Center
export const getGreedyMove = (board: number[][], player: Player) => {
  const opponent = player === Player.Black ? Player.White : Player.Black;
  const validMoves = getValidMoves(board);
  
  if (validMoves.length === 0) return null;

  // 1. Check for Immediate Win (5 in a row)
  for (const move of validMoves) {
    if (checkPotentialLine(board, move.row, move.col, player, 5)) return move;
  }

  // 2. Block Opponent Win (Block 5)
  for (const move of validMoves) {
    if (checkPotentialLine(board, move.row, move.col, opponent, 5)) return move;
  }

  // 3. Form Open 4 (Guaranteed win next turn usually)
  for (const move of validMoves) {
    if (checkPotentialLine(board, move.row, move.col, player, 4)) return move;
  }

  // 4. Block Opponent Open 4
  for (const move of validMoves) {
    if (checkPotentialLine(board, move.row, move.col, opponent, 4)) return move;
  }

  // 5. Form Open 3
  for (const move of validMoves) {
    if (checkPotentialLine(board, move.row, move.col, player, 3)) return move;
  }

  // 6. Fallback: Pick center-most available or random
  // Sort by distance to center (7,7)
  validMoves.sort((a, b) => {
    const distA = Math.abs(a.row - 7) + Math.abs(a.col - 7);
    const distB = Math.abs(b.row - 7) + Math.abs(b.col - 7);
    return distA - distB;
  });

  // Add a little randomness to the top 3 best heuristic moves to avoid loops
  const topCandidates = validMoves.slice(0, 3);
  return topCandidates[Math.floor(Math.random() * topCandidates.length)];
};

// Helper to simulate placing a stone and checking line length
const checkPotentialLine = (
  board: number[][], 
  r: number, 
  c: number, 
  player: Player, 
  targetLength: number
): boolean => {
  // Directions: Horizontal, Vertical, Diagonal Down-Right, Diagonal Down-Left
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

  for (const [dr, dc] of directions) {
    let count = 1; // Start with the stone we are placing

    // Check positive direction
    for (let i = 1; i < 5; i++) {
      const nr = r + dr * i;
      const nc = c + dc * i;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
      if (board[nr][nc] === player) count++;
      else break; // Stop at empty or opponent
    }

    // Check negative direction
    for (let i = 1; i < 5; i++) {
      const nr = r - dr * i;
      const nc = c - dc * i;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) break;
      if (board[nr][nc] === player) count++;
      else break;
    }

    if (count >= targetLength) return true;
  }
  return false;
};
