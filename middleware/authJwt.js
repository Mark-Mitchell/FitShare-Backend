const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "ERROR: No token provided. (NoTokenError)",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      // check if token is expired first
      if (JSON.stringify(err).includes("TokenExpiredError")) {
        res.status(403).send({
          message:
            "ERROR: Your session has expired, please log in again. (TokenExpiredError)",
        });
        return;
      } else {
        return res.status(401).send({
          message: "ERROR: Unauthorized!",
        });
      }
    }

    req.userId = decoded.id;
    // send back user info except the password
    User.findByPk(req.userId).then((user) => {
      if (user) {
        const { id, email, username, createdAt, updatedAt } = user.dataValues;
        const userOutput = {
          id,
          email,
          username,
          createdAt,
          updatedAt,
        };
        res.status(200).send({
          message: "SUCCESS: Successfully logged in.",
          user: userOutput,
        });
      }
    });
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      return res.status(403).send({
        message: "Require Admin role",
      });
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      return res.status(403).send({
        message: "Require Mod role!",
      });
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator" || roles[i].name === "admin") {
          next();
          return;
        }
      }

      return res.status(403).send({
        message: "Require mod or admin",
      });
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};

module.exports = authJwt;
