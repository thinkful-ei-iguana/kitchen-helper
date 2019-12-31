BEGIN;

TRUNCATE
  recipes,
  users
  RESTART IDENTITY CASCADE;
psql -U dunder_mifflin -d recipes_test -f ./seeds/seed/thingful_tables.sql

INSERT INTO users (first_name, last_name, email, password)
VALUES
  ('Calvin', 'Rosehart', 'testuser.com', 'abcde12345'),
  ('Mandee', 'Rosehart', 'recipemaker@yahoo.com', 'abcd1234');


INSERT INTO recipes (title, ingredients, recipe_description, time_to_make)
VALUES
  ('stew', 'meat, potatoes, beef stock, spices', 'makes meat and potato stew for 4', 24:30),
  ('bread', 'flour, yeast, sugar, milk, etc', 'makes a loaf of tasty homemade bread', 35:00);
  ('meat_pie', 'ground beef, sugar, flour, corn, chopped onion, water, etc', 'makes a meat filled pie with upper and low crust, feeds 6', 25:00);
  



COMMIT;