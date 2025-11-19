import { GoogleGenAI, Type } from "@google/genai";
import { BOARD_SIZE, WIN_STREAK } from "../constants";
import { Player } from "../types";

// Initialize Gemini Client
// The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const getAiMove = async (
  board: number[][],
  aiPlayer: Player,
  difficulty: 'easy' | 'hard' = 'hard'
): Promise<{ row: number; col: number; reasoning: string; winRate: number }> => {
  
  // Convert board to string representation for the prompt
  // 0 = ., 1 = X (Black), 2 = O (White)
  let boardStr = "   ";
  for(let c=0; c<BOARD_SIZE; c++) boardStr += (c % 10).toString() + " ";
  boardStr += "\n";
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    boardStr += (r % 10).toString() + "  ";
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = board[r][c];
      if (cell === Player.None) boardStr += ". ";
      else if (cell === Player.Black) boardStr += "X ";
      else if (cell === Player.White) boardStr += "O ";
    }
    boardStr += "\n";
  }

  const playerSymbol = aiPlayer === Player.Black ? "X" : "O";
  const opponentSymbol = aiPlayer === Player.Black ? "O" : "X";
  
  const systemInstruction = `
    You are a Grandmaster Gomoku (Five-in-a-Row) AI engine comparable to AlphaZero. 
    The board is ${BOARD_SIZE}x${BOARD_SIZE}. To win, you need ${WIN_STREAK} stones in a row (horizontal, vertical, or diagonal).
    
    You are playing as '${playerSymbol}'. 
    The opponent is '${opponentSymbol}'.
    
    Your Goal:
    1. Analyze the board state critically.
    2. Identify threats (opponent has 3 or 4 in a row).
    3. Identify winning opportunities (you have 3 or 4 in a row).
    4. If no immediate threats/wins, play strategically to control the center or build potential connections.
    5. Return the move coordinates (row, col) which are 0-indexed. 
    6. Provide a win probability estimation between -1.0 (Loss sure) to 1.0 (Win sure).
    7. Provide a short, strategic reasoning for your move.

    CRITICAL: You CANNOT place a stone on an already occupied spot (marked X or O). Check the board string carefully.
  `;

  const prompt = `
    Current Board State:
    ${boardStr}

    It is your turn (${playerSymbol}). 
    Respond in JSON format with the best move.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            row: { type: Type.INTEGER, description: "The row index (0-14)" },
            col: { type: Type.INTEGER, description: "The column index (0-14)" },
            reasoning: { type: Type.STRING, description: "Strategic explanation of the move" },
            winRate: { type: Type.NUMBER, description: "Estimated win probability (-1.0 to 1.0)" }
          },
          required: ["row", "col", "reasoning", "winRate"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      return result;
    }
    
    throw new Error("No response text from Gemini");

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Fallback logic or simple random empty spot if AI fails (should act as fail-safe)
    // Simple fallback: Find center-most empty spot
    let bestR = 7, bestC = 7;
    if (board[7][7] !== 0) {
       // extremely naive fallback scan
       for(let r=0; r<BOARD_SIZE; r++){
           for(let c=0; c<BOARD_SIZE; c++) {
               if (board[r][c] === 0) {
                   return { row: r, col: c, reasoning: "Fallback move due to AI connection error.", winRate: 0 };
               }
           }
       }
    }
    return { row: bestR, col: bestC, reasoning: "Fallback center.", winRate: 0 };
  }
};