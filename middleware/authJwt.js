const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided",
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
          message: "Unauthorized!",
        });
      }
    }
    req.userId = decoded.id;
    console.log("SUCCESSFULLY LOGGED IN");
    next();
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
