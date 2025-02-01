import React, { useState, useEffect } from "react";
import Square from "./Square";
import { io } from "socket.io-client";

// Connect to the server
const socket = io("http://192.168.1.10:5000");  // Use your local IP address here

function Board({ squares, onPlay, xIsNext, gameOver, winner }) {
  const handleClick = (index) => {
    if (gameOver || squares[index]) return; // Prevent clicking on an already filled square or if the game is over
    onPlay(index);
  };

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  };

  const calculateWinner = (squares) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of winningCombinations) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winnerDetected = calculateWinner(squares);
  const isTie = !winnerDetected && squares.every(square => square !== null);  // Check for tie (board full and no winner)

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)} {renderSquare(1)} {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)} {renderSquare(4)} {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)} {renderSquare(7)} {renderSquare(8)}
      </div>

      <h2>
        {winnerDetected
          ? `Winner: ${winnerDetected}`
          : isTie
          ? "It's a Tie!"
          : `Next Player: ${xIsNext ? "X" : "O"}`}
      </h2>
    </div>
  );
}

export default Board;
