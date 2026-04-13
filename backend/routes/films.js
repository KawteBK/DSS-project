const express = require("express");
const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");
const router = express.Router();

const FILMS_PATH = path.join(__dirname, "../data/films.json");
const SCHEMA_PATH = path.join(__dirname, "../data/film.schema.json");

const ajv = new Ajv();
const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH));
const validate = ajv.compile(schema);

// Helpers 

function readFilms() {
  return JSON.parse(fs.readFileSync(FILMS_PATH));
}

function writeFilms(data) {
  fs.writeFileSync(FILMS_PATH, JSON.stringify(data, null, 2));
}

function nextId(films) {
  return films.length > 0 ? Math.max(...films.map((f) => f.id)) + 1 : 1;
}

//  Auth Middleware 

function isAdmin(req, res, next) {
  if (req.headers.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only." });
  }
  next();
}

//  GET /films 
// Supports: ?genre=Action  ?actor=DiCaprio  ?status=upcoming
//           ?year=asc|desc  ?rating=asc|desc  ?title=asc|desc

router.get("/", (req, res) => {
  const { genre, actor, status, year, rating, title, director } = req.query;

  let films = readFilms().films;

  // --- Filtering ---
  if (genre) {
    films = films.filter((f) =>
      f.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
    );
  }

  if (actor) {
    films = films.filter((f) =>
      f.actors.some((a) => a.toLowerCase().includes(actor.toLowerCase()))
    );
  }

  if (status) {
    films = films.filter((f) => f.status === status);
  }

  if (director) {
    films = films.filter((f) =>
      f.director.toLowerCase().includes(director.toLowerCase())
    );
  }

  // --- Sorting ---
  if (year) {
    films.sort((a, b) => (year === "desc" ? b.year - a.year : a.year - b.year));
  }

  if (rating) {
    films.sort((a, b) =>
      rating === "desc" ? b.rating - a.rating : a.rating - b.rating
    );
  }

  if (title) {
    films.sort((a, b) =>
      title === "desc"
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title)
    );
  }

  res.json(films);
});

//  GET /films/:id 
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { films } = readFilms();
  const film = films.find((f) => f.id === id);

  if (!film) return res.status(404).json({ message: "Film not found." });
  res.json(film);
});

//  POST /films (admin) 

router.post("/", isAdmin, (req, res) => {
  const body = req.body;

  const valid = validate(body);
  if (!valid) {
    return res.status(400).json({ message: "Validation failed.", errors: validate.errors });
  }

  const data = readFilms();
  const newFilm = { id: nextId(data.films), ...body };
  data.films.push(newFilm);
  writeFilms(data);

  res.status(201).json(newFilm);
});

// PUT /films/:id (admin) 

router.put("/:id", isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  const valid = validate(body);
  if (!valid) {
    return res.status(400).json({ message: "Validation failed.", errors: validate.errors });
  }

  const data = readFilms();
  const index = data.films.findIndex((f) => f.id === id);

  if (index === -1) return res.status(404).json({ message: "Film not found." });

  data.films[index] = { id, ...body };
  writeFilms(data);

  res.json(data.films[index]);
});

//  DELETE /films/:id (admin) 

router.delete("/:id", isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const data = readFilms();
  const index = data.films.findIndex((f) => f.id === id);

  if (index === -1) return res.status(404).json({ message: "Film not found." });

  const deleted = data.films.splice(index, 1)[0];
  writeFilms(data);

  res.json({ message: "Film deleted.", film: deleted });
});

module.exports = router;