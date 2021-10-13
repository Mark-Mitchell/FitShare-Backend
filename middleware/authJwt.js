const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const db = require("../models");

const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token || token === "null") {
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
      } else if (JSON.stringify(err).includes("invalid signature")) {
        return res.status(401).send({
          message: "ERROR: Unauthorized! (Invalid signature)",
        });
      } else {
        return res.status(401).send({
          message: "ERROR: Unauthorized!",
        });
      }
    }

    req.userId = decoded.id;
    next();
    // send back user info except the password
    // User.findByPk(req.userId).then((user) => {
    //   if (user) {
    //     const { id, email, username, createdAt, updatedAt } = user.dataValues;
    //     const userOutput = {
    //       id,
    //       email,
    //       username,
    //       createdAt,
    //       updatedAt,
    //     };
    //     res.status(200).send({
    //       message: "SUCCESS: Successfully logged in.",
    //       user: userOutput,
    //     });
    //     // next();
    //   }
    // });
  });
  // next();
};

returnUserInfo = (req, res, next) => {
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
      return res.status(200).send({
        message: "SUCCESS: Successfully logged in.",
        user: userOutput,
      });
      // next();
    } else {
      return res.status(401).send({
        message: "ERROR - Please try to login again. (UserDoesNotExist)",
      });
    }
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
  returnUserInfo,
};

module.exports = authJwt;
