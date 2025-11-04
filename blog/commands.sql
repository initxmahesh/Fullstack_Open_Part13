-- Creating the blogs table

CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);


-- Inserting the data into the blogs table
INSERT INTO blogs (author, url, title, likes)
VALUES 
  ('Mahesh Chaudhary', 'https://github.com/initxmahesh', 'Learning Postgres with the Fullstack open', 500),
  ('Dev', 'https://devil.io/devmaster', 'Managing the postgres database', 1000);
