const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const USERS_PATH = path.join(__dirname, "../data/users.json");

// POST /login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const { users } = JSON.parse(fs.readFileSync(USERS_PATH));
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  res.json({ role: user.role, username: user.username });
});

module.exports = router;