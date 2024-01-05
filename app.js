import express from "express";
import fs from "fs";
import pg from "pg";

const app = express();
const expressPort = 8000;
const db = new pg.Pool({
  connectionString: "postgres://localhost/book-store",
});

// Initial Middleware
app.use(express.json());
app.use(express.static("public"));

// CRUD Routes
// READ - get all books route
app.get("/books", (req, res, next) => {
  db.query("SELECT * FROM books")
    .then((data) => {
      console.log("Success getting book data", data.rows);
      res.send(data.rows);
    })
    .catch((err) => {
      console.error("Error getting all books:", err.stack);
      next(err);
    });
});

// READ only one book
app.get("/books/:id", (req, res, next) => {
  const { id } = req.params;
  db.query("SELECT * FROM books WHERE book_id = $1", [id])
    .then((data) => {
      if (data.rows.length < 1) {
        console.log("Book not found");
        res.status(404).send("Book not found");
      } else {
        console.log("Success getting single book:", data.rows);
        res.send(data.rows);
      }
    })
    .catch((err) => {
      console.error("Error getting single book:", err.stack);
      next(err);
    });
});

// CREATE Route - POST
app.post("/books", (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    console.error("Missing title or author");
    res.status(400).send("Missing title or author");
  } else {
    db.query("INSERT INTO books (title, author) VALUES ($1, $2)", [
      title,
      author,
    ])
      .then((data) => {
        console.log("Success adding new book", title);
        res.send(`Success adding new book: ${title}`);
      })
      .catch((err) => {
        console.error("Error adding new book:", err.stack);
        next(err);
      });
  }
});

// UPDATE - PATCH route
app.patch("/books/:id", (req, res, next) => {
  const { id } = req.params;
  const { title, author } = req.body;
  db.query(
    "UPDATE books SET title = COALESCE($1, title), author = COALESCE($2, author) WHERE book_id = $3",
    [title, author, id]
  )
    .then((data) => {
      console.log("Success updating book:", id);
      res.send("Success updating book");
    })
    .catch((err) => {
      console.error("Error updating book:", err.stack);
      next(err);
    });
});

// DELETE route
app.delete("/books/:id", (req, res, next) => {
  const { id } = req.params;
  db.query("DELETE FROM books WHERE book_id = $1", [id])
    .then((data) => {
      console.log("Success deleting book:", id);
      res.send("Success deleting book");
    })
    .catch((err) => {
      console.error("Error deleting book:", err.stack);
      next(err);
    });
});

// Final middleware and error handling
app.get("/*", (req, res) => {
  console.error("Bad URL");
  res.status(404).send("Bad url");
});

app.use((err, req, res) => {
  console.error("Reached error handling middleware", err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(expressPort, () => {
  console.log("Listening on port:", expressPort);
});
