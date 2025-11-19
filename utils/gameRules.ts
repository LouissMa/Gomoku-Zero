import { BOARD_SIZE, WIN_STREAK } from '../constants';
import { Player, GameStatus, Move } from '../types';

export const createEmptyBoard = () => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(Player.None));

export const checkWin = (board: number[][], r: number, c: number, player: Player): boolean => {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of directions) {
    let count = 1;
    // Check positive direction
    for (let i = 1; i < WIN_STREAK; i++) {
      const nr = r + dr * i, nc = c + dc * i;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || board[nr][nc] !== player) break;
      count++;
    }
    // Check negative direction
    for (let i = 1; i < WIN_STREAK; i++) {
      const nr = r - dr * i, nc = c - dc * i;
      if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE || board[nr][nc] !== player) break;
      count++;
    }
    if (count >= WIN_STREAK) return true;
  }
  return false;
};

export const getValidMoves = (board: number[][]): {row: number, col: number}[] => {
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

export const checkDraw = (board: number[][]): boolean => {
    return getValidMoves(board).length === 0;
}