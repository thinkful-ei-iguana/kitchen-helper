const path = require("path");
const express = require("express");
const RecipelistsService = require("./recipes-service");
const recipelistsRouter = express.Router();
const jsonParser = express.json();

const serializeRecipelists = list => ({
  id: list.id,
  title: list.title,
  date: list.date
});

recipelistsRouter.route("/");

recipelistsRouter.route("/:recipe_id");

module.exports = {
  serializeRecipelists,
  recipelistsRouter
};
