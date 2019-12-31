const path = require("path");
const express = require("express");
const RecipelistsService = require("./recipes-service");
const recipelistsRouter = express.Router();
const jsonBodyParser = express.json();

const serializeRecipelists = list => ({
  id: list.id,
  title: list.title,
  date: list.date
});

recipelistsRouter.post("/", jsonBodyParser, (req, res, next) => {
  for (const field of [
    "title",
    "recipe_description",
    "recipe_ingredients",
    "time_to_make",
    "date_created"
  ]) {
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing ${field} in request body`
      });
  }

  const {
    id,
    title,
    recipe_description,
    recipe_ingredients,
    time_to_make,
    date_created
  } = req.body;

  RecipelistsService.createNewRecipe(
    id,
    title,
    recipe_description,
    recipe_ingredients,
    time_to_make,
    date_created
  )
    .then(() => {
      return res.status(201);
    })
    .catch(error => {
      return res.status(500);
    });

  RecipelistsService.hasRecipeWithTitle(req.app.get("db"))
    .then(hasRecipeWithTitle => {
      if (hasRecipeWithTitle)
        return res
          .status(400)
          .json({ error: "Error occured at recipes-router.js line 40" });

      return RecipelistsService.insertRecipe(req.app.get("db"), newRecipe).then(
        user => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
            .json(RecipelistsService.serializeUser(recipe));
        }
      );
    })
    .catch(next);
});

recipelistsRouter.route("/");

recipelistsRouter.route("/:recipe_id");

module.exports = {
  serializeRecipelists,
  recipelistsRouter
};
