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
  });
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

const authJwt = {
  verifyToken,
  returnUserInfo,
};

module.exports = authJwt;
