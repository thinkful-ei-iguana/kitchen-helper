DROP TABLE IF EXISTS recipes;




CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  recipe_description TEXT NOT NULL,
  recipe_ingredients TEXT NOT NULL UNIQUE,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);
