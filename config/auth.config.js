let config;

if (!process.env.SECRET) {
  config = require("./config");
}

const secret = process.env.SECRET || config.secret;
module.exports = {
  secret,
};
