const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save user to db
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bycrypt.hashSync(req.body.password, 8),
  }).then(() =>
    res.status(200).send({
      message:
        "You have successfully registered your account. Please log into it using your credentials!",
    })
  );
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (!user) {
      return res.status(404).send({
        message:
          "There is no account using your email. Please check your input or create an account.",
      });
    }

    const passwordIsValid = bycrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "The password you provided is not correct. Please try again.",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  });
};
