import React from 'react';
import { BOARD_SIZE, BOARD_COLOR } from '../constants';
import { Player, Move } from '../types';
import Stone from './Stone';

interface BoardProps {
  board: number[][];
  lastMove: Move | null;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, lastMove, onCellClick, disabled }) => {
  return (
    <div 
      className={`relative shadow-2xl rounded-sm p-4 select-none transition-opacity ${disabled ? 'opacity-90' : 'opacity-100'}`}
      style={{ backgroundColor: BOARD_COLOR, width: 'fit-content' }}
    >
      {/* The Grid System */}
      <div 
        className="grid"
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 36px)`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, 36px)`,
        }}
      >
        {board.map((row, r) => (
          row.map((cell, c) => {
            const isLast = lastMove?.row === r && lastMove?.col === c;
            
            // Grid Lines Logic
            const isTop = r === 0;
            const isBottom = r === BOARD_SIZE - 1;
            const isLeft = c === 0;
            const isRight = c === BOARD_SIZE - 1;

            // Center dot (Tengen)
            const isCenter = r === 7 && c === 7;
            // Star points (Hoshi) for 15x15 are usually 3,3; 3,11; 11,3; 11,11; 7,7
            const isStar = (r === 3 || r === 11) && (c === 3 || c === 11) || isCenter;

            return (
              <div 
                key={`${r}-${c}`}
                onClick={() => !disabled && cell === Player.None && onCellClick(r, c)}
                className={`relative w-9 h-9 flex items-center justify-center ${!disabled && cell === Player.None ? 'cursor-pointer hover:bg-black/5' : ''}`}
              >
                {/* Horizontal Line */}
                <div 
                  className="absolute h-[1px] bg-[#5d4037]"
                  style={{ 
                    left: isLeft ? '50%' : '0', 
                    right: isRight ? '50%' : '0',
                    top: '50%'
                  }}
                />
                
                {/* Vertical Line */}
                <div 
                  className="absolute w-[1px] bg-[#5d4037]"
                  style={{ 
                    top: isTop ? '50%' : '0', 
                    bottom: isBottom ? '50%' : '0',
                    left: '50%'
                  }}
                />

                {/* Star Point Dot */}
                {isStar && (
                  <div className="absolute w-1.5 h-1.5 bg-[#5d4037] rounded-full z-0" />
                )}

                {/* Stone */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-0.5">
                   <Stone player={cell} isLastMove={isLast} />
                </div>
              </div>
            );
          })
        ))}
      </div>
      
      {/* Coordinate Labels */}
      <div className="absolute -bottom-6 left-4 right-4 flex justify-between text-xs text-gray-500 font-mono">
        {Array.from({length: BOARD_SIZE}).map((_, i) => (
          <span key={i} className="w-9 text-center">{String.fromCharCode(65 + i)}</span>
        ))}
      </div>
      <div className="absolute top-4 -left-6 bottom-4 flex flex-col justify-between text-xs text-gray-500 font-mono">
        {Array.from({length: BOARD_SIZE}).map((_, i) => (
          <span key={i} className="h-9 flex items-center">{BOARD_SIZE - i}</span>
        ))}
      </div>
    </div>
  );
};

export default Board;