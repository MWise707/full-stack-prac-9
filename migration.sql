DROP TABLE IF EXISTS books;

CREATE TABLE books (
  book_id SERIAL PRIMARY KEY,
  title text,
  author text
);

INSERT INTO books (title, author) VALUES ('Gone With the Wind', 'Greg Greg');
INSERT INTO books (title, author) VALUES ('Withering Heights', 'Janet Janet');
INSERT INTO books (title, author) VALUES ('Bible', 'God');