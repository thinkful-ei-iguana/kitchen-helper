const express = require("express");
const usersRouter = express.Router();
const logger = require("../logger");
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
        res.sendStatus(403);
      } else {
        AuthService.getUserWithUserName(
          req.app.get("db"),
          authorizedData.sub
        ).then(dbUser => {
          delete dbUser.password;
          res.json({ dbUser });
        });
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
    // delete dbUser.id;
    delete dbUser.password;
    res.json({
      dbUser
    });
  });
});

usersRouter.route("/src/:id").get(bodyParser, (req, res, next) => {
  const { id } = req.params;
  AuthService.getUserWithId(req.app.get("db"), id).then(dbUser => {
    // delete dbUser.id;
    delete dbUser.password;
    res.json({
      dbUser
    });
  });
});

usersRouter.patch("/edit/:id", bodyParser, async (req, res, next) => {
  const knexInstance = req.app.get("db");
  const { id } = req.params;
  const { first_name, user_name, user_email, password } = req.body;
  let updatedData = {
    first_name,
    user_name,
    user_email
  };

  const numberOfValues = Object.values(updatedData).filter(Boolean).length;
  if (numberOfValues === 0) {
    return res.status(400).json({
      error: {
        message:
          "Request body must contain either username, name, email, location, password or avatar"
      }
    });
  }

  if (user_name) {
    const hasUserUsername = await UsersService.hasUserWithUserName(
      req.app.get("db"),
      user_name
    );
    if (hasUserUsername) {
      return res.status(400).json({
        error: "Username already taken"
      });
    } else {
      updatedData.user_name = user_name;
    }
  }

  if (password) {
    const passwordError = UsersService.validatePassword(password);
    if (passwordError) {
      console.log(passwordError);
      console.log(this.props);
      console.log("hi");
      return res.status(400).json({
        error: passwordError
      });
    }
    await UsersService.hashPassword(password).then(hashedPassword => {
      updatedData.password = hashedPassword;
    });
  }

  return UsersService.updateAccount(knexInstance, id, updatedData).then(
    update => {
      console.log(update, "update ran");
      res.status(204).json(UsersService.serializeUser(update));
    }
  );
});

module.exports = usersRouter;
