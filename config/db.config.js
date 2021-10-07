let config;

if (!process.env.HOST) {
  config = require("./env.variables");
}

module.exports = {
  HOST: process.env.HOST || config.host,
  USER: process.env.USER || config.user,
  PASSWORD: process.env.PASSWORD || config.password,
  DB: process.env.DB || config.db,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
