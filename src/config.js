module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL || "postgresql://postgres@localhost/postgres",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  API_TOKEN: process.env.API_TOKEN || "8a53d872-8ef1-4f8f-946e-fbe0bb791994"
};
