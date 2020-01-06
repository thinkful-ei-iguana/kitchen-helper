const express = require("express");
const usersRouter = express.Router();
const bodyParser = express.json();
const UsersService = require("./users-service");
const path = require("path");
const jwt = require("jsonwebtoken");
const AuthService = require("../auth/auth-service");
const config = require("../config");

const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

usersRouter
  .route("/")
  .post(bodyParser, (req, res, next) => {
    const { first_name, user_name, user_email, password } = req.body;
    for (const field of ["first_name", "user_name", "user_email", "password"]) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
      }
    }
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    UsersService.hasUserWithUserName(req.app.get("db"), user_name)
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: "Username already taken" });

        return UsersService.hashPassword(password).then(hashedPassword => {
          const newAccount = {
            first_name,
            user_name,
            user_email,
            password: hashedPassword,
            date_created: "now()"
          };

          return UsersService.insertUser(req.app.get("db"), newAccount).then(
            accounts => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${accounts.id}`))
                .json(UsersService.serializeUser(accounts));
            }
          );
        });
      })
      .catch(next);
  })
  .get(checkToken, (req, res, next) => {
    jwt.verify(req.token, config.JWT_SECRET, (err, authorizedData) => {
      if (err) {
        //If error send Forbidden (403)
        console.log("ERROR: Could not connect to the protected route");
        res.sendStatus(403);
      } else {
        //If token is successfully verified, we can send the authorized data
        console.log(authorizedData);
        AuthService.getUserWithUserName(
          req.app.get("db"),
          authorizedData.sub
        ).then(dbUser => {
          delete dbUser.password;
          res.json({ dbUser });
        });

        console.log("SUCCESS: Connected to protected route");
      }
    });
  });

usersRouter.route("/:user_name").delete((req, res, next) => {
  const { user_name } = req.params;
  const knexInstance = req.app.get("db");

  UsersService.deleteUser(knexInstance, user_name)
    .then(UsersService.deleteRecipesOfDeletedUser(knexInstance, user_name))
    .then(res.status(204).end())
    .catch(next);
});

usersRouter.route("/src/:user_name").get(bodyParser, (req, res, next) => {
  const { user_name } = req.params;
  AuthService.getUserWithUserName(req.app.get("db"), user_name).then(dbUser => {
    delete dbUser.id;
    delete dbUser.password;
    res.json({
      dbUser
    });
  });
});

module.exports = usersRouter;
