import { useState } from "react";
import Square from "./Square";

function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) return;

    const newSquares = squares.slice();
    newSquares[index] = xIsNext ? "X" : "O";
    
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function renderSquare(index) {
    return <Square value={squares[index]} onClick={() => handleClick(index)} />;
  }

  const winner = calculateWinner(squares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)} {renderSquare(1)} {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)} {renderSquare(4)} {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)} {renderSquare(7)} {renderSquare(8)}
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  for (let [a, b, c] of winningCombinations) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function Board({ squares, onPlay }) {
    function handleClick(index) {
      if (squares[index] || calculateWinner(squares)) return;
      
      const newSquares = squares.slice();
      newSquares[index] = xIsNext ? "X" : "O";
      
      onPlay(newSquares);
    }
  
    return (
      <div>
        <div className="board-row">
          {squares.map((square, i) => (
            <Square key={i} value={square} onClick={() => handleClick(i)} />
          ))}
        </div>
      </div>
    );
  }
  
export default Board;
