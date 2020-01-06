BEGIN;

TRUNCATE
  recipes,
  accounts
  RESTART IDENTITY CASCADE;

-- psql -U dunder_mifflin -d kitchen-helper -f C:\Users\calvi\OneDrive\Documents\GitHub\kitchen-helper\seeds\seed.recipes.sql


INSERT INTO accounts (first_name, user_name, user_email, password)
VALUES
  ('Calvin', 'thunderer', 'testuser.com', 'ABCde12345!'),
  ('Mandee', 'Lightning', 'recipemaker@yahoo.com', 'Abcd1234!');


INSERT INTO recipes (title, recipe_description, recipe_ingredients, time_to_make, create_by)
VALUES
  ('Stew', 'makes meat and potato stew for 4', 'meat, potatoes, beef stock, spices', '24:30', 1),
  ('Bread', 'makes a loaf of tasty homemade bread', 'flour, yeast, sugar, milk, etc', '35:00', 1),
  ('Meat-Pie', 'makes a meat filled pie with upper and low crust, feeds 6', 'ground beef, sugar, flour, corn, chopped onion, water, etc', '25:00', 2);
  



COMMIT;