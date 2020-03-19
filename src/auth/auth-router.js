const express = require("express");
const AuthService = require("./auth-service");
const authRouter = express.Router();
const jsonBodyParser = express.json();
const requireAuth = require("../middleware/jwt-auth")

authRouter.post("/login", jsonBodyParser, (req, res, next) => {
  const { user_name, password } = req.body;
  const loginUser = { user_name, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null)
      return res.status(400).json({
        error: `Missing ${key} in request body`
      });

  AuthService.getUserWithUserName(req.app.get("db"), loginUser.user_name)
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: "Incorrect user_name or password"
        });
      return AuthService.comparePasswords(
        loginUser.password,
        dbUser.password
      ).then(compareMatch => {
        if (!compareMatch)
          return res.status(400).json({
            error: "Incorrect user_name or passwordV2"
          });
        const sub = dbUser.user_name;
        const payload = { user_id: dbUser.id };

        res.send({
          authToken: AuthService.createJwt(sub, payload)
        });
      });
    })
    .catch(next);
});

authRouter
  .put("/token", jsonBodyParser, (req, res, next) => {
    try {
      const subject = req.body.user.user_name;
      const payload = {
        user_id: req.body.user.id,
        name: req.body.user.first_name,
      };
      res.send({
        authToken: AuthService.createJwt(subject, payload),
      });
    }
    catch (error) { console.log(error) };
  });

module.exports = authRouter;
