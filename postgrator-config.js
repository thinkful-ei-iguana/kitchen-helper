require("dotenv").config();

module.exports = {
  migrationsDirectory: "mirations",
  driver: "pg",
  connectionString: process.env.DB_URL
};
