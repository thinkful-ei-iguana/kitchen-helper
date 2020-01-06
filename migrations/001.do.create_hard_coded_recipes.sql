DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS recipes;


CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  recipe_description TEXT NOT NULL,
  recipe_ingredients TEXT NOT NULL,
  time_to_make TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);



CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  user_name TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);
