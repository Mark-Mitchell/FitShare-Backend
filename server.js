const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./models/");

// FOR DEVELOPMENT ONLY
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
});
// // For Production:
// // db.sequelize.sync();

app.use(
  cors({
    origin: "*", // allow all origins
    credentials: true,
    optionSuccessStatus: 200,
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/unlistedWorkouts.routes")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Congrats, you have connected to the API!" });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080 || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
