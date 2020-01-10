const xss = require("xss");
const bcrypt = require("bcryptjs");

const AccountService = {
  hasUserWithUserName(db, user_name) {
    return db("accounts")
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newAccount) {
    return db
      .insert(newAccount)
      .into("accounts")
      .returning("*")
      .then(([user]) => user);
  },
  deleteUser(db, user_name) {
    return db("accounts")
      .where({ user_name })
      .delete();
  },
  deleteRecipesOfDeletedUser(db, user_name) {
    return db("recipes")
      .where({ owner: user_name })
      .delete();
  },
  updateAccount(knex, id, updatedData) {
    return knex("accounts")
      .where({ id })
      .update(updatedData);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return console.log("Password must be longer than 8 characters");
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      user_email: xss(user.user_email),
      user_name: xss(user.user_name),
      password: xss(user.password),
      date_created: new Date(user.date_created)
    };
  }
};

module.exports = AccountService;
