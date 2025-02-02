const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust if your frontend runs on a different port
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = "mongodb+srv://system:Pass123@cluster0.ulmfv.mongodb.net/tic-tac-toe";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define the game schema
const gameSchema = new mongoose.Schema({
  board: { type: [String], default: Array(9).fill(null) },
  currentTurn: { type: String, default: "X" },
  gameStatus: { type: String, default: "ongoing" }, // 'ongoing', 'X won', 'O won', 'Tie'
});

const Game = mongoose.model("Game", gameSchema);

// Create a new game
app.post("/new-game", async (req, res) => {
  try {
    const newGame = new Game();
    await newGame.save();
    res.json({ gameId: newGame._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create a new game" });
  }
});

// Get game state
app.get("/game/:id", async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: "Invalid game ID" });
  }
});

// Make a move
app.post("/game/:id/move", async (req, res) => {
  try {
    const { index, player } = req.body;
    const game = await Game.findById(req.params.id);

    if (!game) return res.status(404).json({ error: "Game not found" });
    if (game.gameStatus !== "ongoing") return res.status(400).json({ error: "Game is already over" });

    // Check if the move is valid
    if (game.board[index] !== null) return res.status(400).json({ error: "Cell is already occupied" });

    // Update board
    game.board[index] = player;
    game.currentTurn = player === "X" ? "O" : "X";

    // Check for a winner
    const winner = calculateWinner(game.board);
    if (winner) {
      game.gameStatus = `${winner} won`;
    } else if (game.board.every((square) => square !== null)) {
      game.gameStatus = "Tie";
    }

    await game.save();
    io.emit("game-update", game); // Emit update to all clients
    res.json(game);
  } catch (error) {
    res.status(400).json({ error: "Invalid request" });
  }
});

// Check for a winner
function calculateWinner(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  return null;
}

server.listen(5000, () => {
  console.log("🚀 Server is running on http://localhost:5000");
});
