import React, { useState, useEffect } from 'react';
import './App.css';

// Useful color variables for theme
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#f50057',
};

// PUBLIC_INTERFACE
function App() {
  // The board is a 9-element array: null, 'X', or 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: [] });
  const [moves, setMoves] = useState(0);

  // Calculate winner & highlight on every board change
  useEffect(() => {
    const winnerData = calculateWinner(board);
    setWinnerInfo(winnerData);
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    // If square is taken or game is over, ignore
    if (board[index] || winnerInfo.winner) return;
    const newBoard = board.slice();
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    setMoves(moves + 1);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: [] });
    setMoves(0);
  }

  let statusText = '';
  if (winnerInfo.winner) {
    statusText = `Winner: ${winnerInfo.winner}`;
  } else if (moves === 9) {
    statusText = `It's a draw!`;
  } else {
    statusText = `Current Turn: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App ttt-app-bg" style={{ minHeight: "100vh" }}>
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-board-container">
          <Board
            squares={board}
            onSquareClick={handleSquareClick}
            winningLine={winnerInfo.line}
          />
        </div>
        <div className="ttt-status" data-testid="game-status">
          {statusText}
        </div>
        <button className="ttt-restart-btn" onClick={handleRestart}>
          Restart Game
        </button>
      </header>
      <footer className="ttt-footer">
        <span>
          Modern Tic-Tac-Toe | <span className="ttt-author">KAVIA Light Theme</span>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  // Generates 3x3 grid
  return (
    <div className="ttt-board" role="grid">
      {[0, 1, 2].map(row =>
        <div key={row} className="ttt-row" role="row">
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;
            const highlight = winningLine && winningLine.includes(idx);
            return (
              <Square
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                key={idx}
                highlight={highlight}
              />
            )
          })}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-highlight' : ''}`}
      onClick={onClick}
      style={highlight ? { color: COLORS.accent, borderColor: COLORS.accent, fontWeight: 700 } : {}}
      tabIndex={0}
      aria-label={`Tic Tac Toe cell${value ? ' ' + value : ''}`}
      data-testid="ttt-square"
    >
      {value}
    </button>
  );
}

// Utility - Checks for winner & returns { winner, line }
function calculateWinner(squares) {
  const lines = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}

export default App;
