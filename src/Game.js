import { useState, useEffect } from "react";
import Board from "./Board";

function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState("");
  const [gameId, setGameId] = useState(null); // To store the game ID

  // Fetch game state from the backend when the component mounts
  useEffect(() => {
    const fetchGameState = async () => {
      if (!gameId) return; // Wait for the gameId to be set

      const response = await fetch(`http://localhost:5000/game/${gameId}`);
      const game = await response.json();

      if (game) {
        setSquares(game.board);
        setXIsNext(game.currentTurn === "X");
        setGameOver(game.gameStatus !== "ongoing");
        setResult(game.gameStatus === "Tie" ? "Tie" : game.gameStatus);
      }
    };

    fetchGameState();
  }, [gameId]);

  // Handle a player's move (same as before, but also updates MongoDB)
  const handlePlay = async (index) => {
    if (squares[index] || gameOver) return; // Ignore if the game is over

    const player = xIsNext ? "X" : "O";
    const newSquares = squares.slice();
    newSquares[index] = player;
    setSquares(newSquares);
    setXIsNext(!xIsNext);

    // Check for winner or tie
    const winner = calculateWinner(newSquares);
    if (winner) {
      setGameOver(true);
      setResult(`${winner} won`);
    } else if (newSquares.every((square) => square !== null)) {
      setGameOver(true);
      setResult("Tie");
    }

    // Send updated game state to the backend (MongoDB)
    await fetch(`http://localhost:5000/game/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index,
        player,
      }),
    });
  };

  // Reset the game state
  const resetGame = async () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setResult("");

    // Create a new game in MongoDB
    const response = await fetch("http://localhost:5000/new-game", {
      method: "POST",
    });
    const game = await response.json();
    setGameId(game.gameId); // Save the new game ID
  };

  return (
    <div className="game">
      <Board squares={squares} onPlay={handlePlay} />
      {!gameOver && (
        <h2>{xIsNext ? "Player 1's Turn (X)" : "Player 2's Turn (O)"}</h2>
      )}
      {gameOver && (
        <div>
          <h2>{result}</h2>
          <button className="reset-button" onClick={resetGame}>
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

// Function to check for a winner
function calculateWinner(squares) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  for (let [a, b, c] of winningCombinations) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return "X" or "O"
    }
  }
  return null; // No winner yet
}

export default Game;
