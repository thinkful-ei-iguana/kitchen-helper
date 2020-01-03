const recipesService = {
  getAllRecipes(knex) {
    return knex("recipes").select("*");
  },
  getAllByUser(knex, accounts) {
    return knex("recipes").where("owner", accounts);
  },
  getRecipeById(knex, id) {
    return knex("recipes")
      .select("*")
      .where("id", id)
      .first();
  },
  insertRecipe(knex, newRecipe) {
    return knex("recipes")
      .insert(newRecipe)
      .returning("*")
      .then(rows => rows[0]);
  },
  deleteRecipe(knex, id) {
    return knex("recipes")
      .where({ id })
      .delete();
  },
  updateRecipe(knex, id, updatedData) {
    return knex("recipes")
      .where({ id })
      .update(updatedData);
  }
};

module.exports = recipesService;
