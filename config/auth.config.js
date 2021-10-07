// const { secret } = require("./password");

const secret = process.env.SECRET || "ENTER LOCAL STRINg";
module.exports = {
  secret,
};
