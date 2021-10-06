const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkAllDataProvided = (req, res, next) => {
  // check if user provided email, username and pw
  if (!req.body.username)
    return res.status(400).send({ message: "Please provide a username." });
  if (!req.body.email)
    return res.status(400).send({ message: "Please provide an email." });
  if (!req.body.password)
    return res.status(400).send({ message: "Please provide a password." });
  next();
};

checkDuplicateUsername = (req, res, next) => {
  // check username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        message:
          "ERROR: Your username is already taken by another account. Please chose a new username.",
      });
    }
    next();
  });
};

checkDuplicateEmail = (req, res, next) => {
  // check email
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      return res.status(400).send({
        message:
          "ERROR: An account using this email already exists. Please log into your account.",
      });
    }
    next();
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).send({
          message: "ERROR: Role doesn't exist: " + req.body.roles[i],
        });
      }
    }
  }

  next();
};

const verifySignUp = {
  checkAllDataProvided,
  checkDuplicateUsername,
  checkDuplicateEmail,
  checkRolesExisted,
};

module.exports = verifySignUp;
