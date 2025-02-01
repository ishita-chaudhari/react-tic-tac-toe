import React, { useState, useEffect } from "react";
import Board from "./Board";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.10:5000");  // Use your local IP address here

function Game() {
  const [game, setGame] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
    gameOver: false,
    winner: null,
  });

  useEffect(() => {
    socket.on("gameUpdate", (updatedGame) => {
      setGame(updatedGame);
    });
  }, []);

  const handlePlay = (index) => {
    if (game.gameOver || game.board[index]) return;

    const newBoard = game.board.slice();
    newBoard[index] = game.xIsNext ? "X" : "O";
    const winner = calculateWinner(newBoard);
    const gameOver = winner || newBoard.every((square) => square !== null);
    const newGameState = {
      board: newBoard,
      xIsNext: !game.xIsNext,
      gameOver,
      winner: winner || (gameOver ? "Tie" : null),
    };

    socket.emit("updateGame", newGameState);
    setGame(newGameState);
  };

  const restartGame = () => {
    const initialGameState = {
      board: Array(9).fill(null),
      xIsNext: true,
      gameOver: false,
      winner: null,
    };
    socket.emit("updateGame", initialGameState);
    setGame(initialGameState);
  };

  const calculateWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  return (
    <div>
      <Board
        squares={game.board}
        onPlay={handlePlay}
        xIsNext={game.xIsNext}
        gameOver={game.gameOver}
        winner={game.winner}
      />
      {game.gameOver && <button onClick={restartGame}>Restart Game</button>}
    </div>
  );
}

export default Game;
