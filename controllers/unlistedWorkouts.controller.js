// const db = require("../models");
// const config = require("../config/auth.config");
// const User = db.user;
// const UnlistedWorkout = db.unlistedWorkout;
// const Role = db.role;

// const Op = db.Sequelize.Op;

// const jwt = require("jsonwebtoken");
// const bycrypt = require("bcryptjs");
// const { unlistedWorkout } = require("../models");

// exports.addUnlistedWorkout = (req, res, next) => {
//   console.log("adding a workout");
//   // Save user to db
//   UnlistedWorkout.create({
//     workout: "req.body.workout",
//     id: "req.body.id",
//     userId: 1,
//   })
//     .then((workout) => {
//       console.log(workout);
//       next();
//       //   if (req.body.roles) {
//       //     Role.findAll({
//       //       where: {
//       //         name: {
//       //           [Op.or]: req.body.roles,
//       //         },
//       //       },
//       //     }).then((roles) => {
//       //       user.setRoles(roles).then(() => {
//       //         res.send({
//       //           message:
//       //             "You have successfully registered your account. Please log into it using your credentials!",
//       //         });
//       //       });
//       //     });
//       //   } else {
//       //     // user role = 1
//       //     user.setRoles([1]).then(() => {
//       //       res.send({
//       //         message:
//       //           "You have successfully registered your account. Please log into it using your credentials!",
//       //       });
//       //     });
//       //   }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message,
//       });
//     });
// };

exports.unlistedWorkoutBoard = (req, res) => {
  res.status(200).send({ message: "SUCCESS - Workout created" });
};
