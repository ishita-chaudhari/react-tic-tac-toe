import React, { useState, useEffect } from "react";
import Game from "./Game";
import './App.css';
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Ensure this is the correct server address

function App() {
  const [playerMessage, setPlayerMessage] = useState(""); // Store messages like "Another player joined"
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
    gameOver: false,
    winner: null,
  });

  useEffect(() => {
    // Listen for game state updates from the server
    socket.on("gameUpdate", (updatedGameState) => {
      setGameState(updatedGameState);
    });

    // Listen for new player joining
    socket.on("newPlayerJoined", (connectedPlayers) => {
      setPlayerMessage(`Player ${connectedPlayers} joined the game!`);
    });

    // Listen for player leaving
    socket.on("newPlayerLeft", (connectedPlayers) => {
      setPlayerMessage(`Player ${connectedPlayers} left the game.`);
    });

    // Cleanup socket connections when the component unmounts
    return () => {
      socket.off("gameUpdate");
      socket.off("newPlayerJoined");
      socket.off("newPlayerLeft");
    };
  }, []);

  const handleMove = (index) => {
    if (gameState.gameOver || gameState.board[index]) return;

    const newBoard = gameState.board.slice();
    newBoard[index] = gameState.xIsNext ? "X" : "O";

    const nextPlayer = !gameState.xIsNext;
    const winner = calculateWinner(newBoard);
    const isGameOver = winner || newBoard.every((square) => square !== null);

    const updatedGameState = {
      board: newBoard,
      xIsNext: nextPlayer,
      gameOver: isGameOver,
      winner: winner || (isGameOver ? "Tie" : null), // Set "Tie" if no winner and board is full
    };

    // Emit the updated game state to the server
    socket.emit("move", updatedGameState);
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>
      {playerMessage && <p>{playerMessage}</p>} {/* Display the player message */}
      <Game
        board={gameState.board}
        onMove={handleMove}
        gameOver={gameState.gameOver}
        winner={gameState.winner}
      />
      {gameState.winner && (
        <h2>{gameState.winner === "Tie" ? "It's a Tie!" : `${gameState.winner} won!`}</h2>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let [a, b, c] of winningCombinations) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
