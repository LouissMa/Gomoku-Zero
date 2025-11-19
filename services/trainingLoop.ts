import { BotType, Player, GameStatus } from '../types';
import { createEmptyBoard, checkWin, checkDraw } from '../utils/gameRules';
import { getAiMove } from './geminiService';
import { getGreedyMove, getRandomMove } from './bots';

// Simulates one full game without UI updates
// Returns the winner (Player.Black (Gemini), Player.White (Bot), or Player.None (Draw))
export const runHeadlessGame = async (
  opponentType: BotType
): Promise<{ winner: Player | null; moves: number }> => {
  
  let board = createEmptyBoard();
  let currentPlayer = Player.Black;
  let status = GameStatus.Playing;
  let movesCount = 0;
  
  // Safety limit to prevent infinite loops
  const MAX_MOVES = 225;

  while (status === GameStatus.Playing && movesCount < MAX_MOVES) {
    let move: { row: number, col: number } | null = null;

    // 1. Determine Move
    if (currentPlayer === Player.Black) {
      // Gemini Turn
      try {
        // Using 'easy' for training loop speed/cost, or 'hard' if you want real benchmark
        // We'll assume 'hard' to actually test intelligence
        const aiResult = await getAiMove(board, currentPlayer);
        move = { row: aiResult.row, col: aiResult.col };
      } catch (e) {
        console.error("Training Loop AI Error", e);
        // Skip game on error
        return { winner: Player.White, moves: movesCount }; 
      }
    } else {
      // Opponent Turn
      if (opponentType === BotType.Random) {
        move = getRandomMove(board);
      } else {
        move = getGreedyMove(board, currentPlayer);
      }
    }

    if (!move) {
        status = GameStatus.Draw;
        break;
    }

    // 2. Apply Move
    board[move.row][move.col] = currentPlayer;
    movesCount++;

    // 3. Check Win/Draw
    if (checkWin(board, move.row, move.col, currentPlayer)) {
      status = GameStatus.Won;
      return { winner: currentPlayer, moves: movesCount };
    } else if (checkDraw(board)) {
        status = GameStatus.Draw;
        return { winner: null, moves: movesCount };
    }

    // 4. Switch Player
    currentPlayer = currentPlayer === Player.Black ? Player.White : Player.Black;
    
    // Small delay to be nice to the API rate limit during loops
    // 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { winner: null, moves: movesCount };
};