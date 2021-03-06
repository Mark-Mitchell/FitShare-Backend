const db = require("../models");
const commonPassword = require("common-password");
// const ROLES = db.ROLES;
const User = db.user;

checkAllDataProvided = (req, res, next) => {
  // check if user provided email, username and pw
  if (!req.body.username)
    return res.status(400).send({ message: "Please provide a username." });
  if (!req.body.email)
    return res.status(400).send({ message: "Please provide an email." });
  if (!req.body.password)
    return res.status(400).send({ message: "Please provide a password." });
  if (req.body.password.length < 8)
    return res.status(400).send({
      message:
        "Your password is too short. Please use a password that is at least 8 characters long.",
    });
  if (commonPassword(req.body.password))
    return res.status(400).send({
      message:
        "Your password is too easy to guess. Please try another password.",
    });

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  if (!validateEmail(req.body.email))
    return res.status(400).send({
      message: "Your email is invalid. Please use a valid email address.",
    });
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

const verifySignUp = {
  checkAllDataProvided,
  checkDuplicateUsername,
  checkDuplicateEmail,
};

module.exports = verifySignUp;
