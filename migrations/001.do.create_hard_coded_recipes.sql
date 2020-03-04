
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS recipes;

CREATE TABLE accounts (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  first_name TEXT NOT NULL,
  user_name TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recipes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL UNIQUE,
  owner INTEGER REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  recipe_description TEXT NOT NULL,
  recipe_ingredients TEXT NOT NULL,
  time_to_make TEXT NOT NULL
);