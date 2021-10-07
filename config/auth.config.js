let config;

if (!process.env.SECRET) {
  config = require("./env.variables");
}

const secret = process.env.SECRET || config.secret;
module.exports = {
  secret,
};
