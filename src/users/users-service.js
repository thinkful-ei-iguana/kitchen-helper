const xss = require("xss");
const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const AccountService = {
  hasUserWithuser_name(db, user_name) {
    return db("users")
      .where({ user_name })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newAccount) {
    return db
      .insert(newAccount)
      .into("users")
      .returning("*")
      .then(([user]) => user);
  },
  deleteUser(db, user_name) {
    return db("users")
      .where({ user_name })
      .delete();
  },
  deleteListingsOfDeletedUser(db, user_name) {
    return db("listings")
      .where({ owner: user_name })
      .delete();
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(accounts) {
    return {
      id: accounts.id,
      name: xss(accounts.name),
      email: xss(accounts.email),
      location: xss(accounts.location),
      user_name: xss(accounts.user_name),
      password: xss(accounts.password),
      date_created: new Date(accounts.date_created)
    };
  }
};

module.exports = AccountService;
