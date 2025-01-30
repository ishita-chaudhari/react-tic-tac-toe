import { useState } from "react";
import Board from "./Board";

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(newSquares) {
    const newHistory = history.slice(0, stepNumber + 1).concat([newSquares]);
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  const currentSquares = history[stepNumber];

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move ? `Go to move #${move}` : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Game;
