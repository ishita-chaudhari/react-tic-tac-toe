import { useState } from "react";
import Board from "./Board";

function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [result, setResult] = useState(""); // Store result message ("X won", "O won", "Tie")

  function handlePlay(index) {
    if (squares[index] || gameOver) return; // Do nothing if the game is over

    const newSquares = squares.slice();
    newSquares[index] = xIsNext ? "X" : "O";

    setSquares(newSquares);
    setXIsNext(!xIsNext);

    // Check if the game is over (either a winner or a tie)
    const winner = calculateWinner(newSquares);
    if (winner) {
      setGameOver(true);
      setResult(`${winner} won`);
    } else if (newSquares.every((square) => square !== null)) {
      setGameOver(true);
      setResult("Tie");
    }
  }

  function resetGame() {
    setSquares(Array(9).fill(null)); // Reset board
    setXIsNext(true);
    setGameOver(false); // Reset game over state
    setResult(""); // Clear result message
  }

  return (
    <div className="game">
      <Board squares={squares} onPlay={handlePlay} xIsNext={xIsNext} />
      {!gameOver && (
        <h2>{xIsNext ? "Player 1's Turn (X)" : "Player 2's Turn (O)"}</h2> // Show Player 1 or Player 2
      )}
      {gameOver && (
        <div>
          <h2>{result}</h2> {/* Display the winner or tie message */}
          <button className="reset-button" onClick={resetGame}>
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
}

// Function to check winner
function calculateWinner(squares) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
  ];

  for (let [a, b, c] of winningCombinations) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return the winner (either "X" or "O")
    }
  }
  return null; // No winner yet
}

export default Game;
