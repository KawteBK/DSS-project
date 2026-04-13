import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import filmsRouter from "./routes/films.js";
import authRouter from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve poster images statically
// Frontend access: <img src="/photos/inception.jpg">
app.use("/photos", express.static(path.join(__dirname, "data/photos")));

// CORS — allow frontend to talk to this API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, role");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

//  Routes 

app.use("/films", filmsRouter);
app.use("/auth", authRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Film Gallery API is running.", version: "1.0.0" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

//  Start 

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});