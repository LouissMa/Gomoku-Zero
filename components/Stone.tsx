import React from 'react';
import { Player } from '../types';

interface StoneProps {
  player: Player;
  isLastMove: boolean;
}

const Stone: React.FC<StoneProps> = ({ player, isLastMove }) => {
  if (player === Player.None) return null;

  const isBlack = player === Player.Black;
  
  return (
    <div className="relative w-[90%] h-[90%] rounded-full shadow-sm flex items-center justify-center transition-all duration-300 animate-in fade-in zoom-in-50">
      {/* Stone Body with Gradient */}
      <div 
        className={`absolute inset-0 rounded-full shadow-[2px_2px_4px_rgba(0,0,0,0.4)] ${
          isBlack 
            ? 'bg-gradient-to-br from-gray-700 via-black to-black' 
            : 'bg-gradient-to-br from-white via-gray-100 to-gray-300'
        }`}
      />
      
      {/* Highlight for 3D effect */}
      <div 
        className={`absolute top-[15%] left-[15%] w-[25%] h-[25%] rounded-full bg-gradient-to-br from-white to-transparent opacity-60 blur-[1px]`}
      />

      {/* Last Move Marker */}
      {isLastMove && (
        <div 
          className={`relative z-10 w-2 h-2 rounded-full ${isBlack ? 'bg-red-500' : 'bg-red-500'} shadow-sm ring-1 ring-white/50`}
        />
      )}
    </div>
  );
};

export default Stone;