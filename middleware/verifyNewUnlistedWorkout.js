const db = require("../models");
const UnlistedWorkout = db.unlistedWorkout;

// const ROLES = db.ROLES;
// const User = db.user;

checkAllDataProvided = (req, res, next) => {
  // check if user provided email, username and pw
  if (!req.body.workout)
    return res.status(400).send({ message: "Please provide a workout." });
  if (!req.body.userId)
    return res.status(400).send({ message: "Please provide the userId." });
  if (req.body.userId !== req.userId)
    return res
      .status(400)
      .send({ message: "Please log in again and then retry. (WrongUserId)" });
  // console.log("Data provided check: " + req.userId);
  next();
};

addUnlistedWorkout = async (req, res, next) => {
  console.log("adding a workout");

  const generateSlug = async () => {
    const possibleCharacters =
      "abcdefghijklmnopqrstuvwxyz123456789012345678901234567890";
    let output = "";

    for (let i = 0; i < 5; i++) {
      output += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );

      if (i === 2) {
        const currentId = await UnlistedWorkout.max("id");
        const id = !currentId ? 1 : currentId + 1;
        output += id;
      }
    }
    return output;
  };

  const slug = await generateSlug();
  req.slug = slug;
  console.log("LOCAL: " + req.slug);

  UnlistedWorkout.create({
    workout: req.body.workout,
    // id: req.body.id,
    userId: req.body.userId,
    slug: slug,
  })
    .then((workout) => {
      console.log(workout);
      console.log("FINISHED");
      next();
      //   if (req.body.roles) {
      //     Role.findAll({
      //       where: {
      //         name: {
      //           [Op.or]: req.body.roles,
      //         },
      //       },
      //     }).then((roles) => {
      //       user.setRoles(roles).then(() => {
      //         res.send({
      //           message:
      //             "You have successfully registered your account. Please log into it using your credentials!",
      //         });
      //       });
      //     });
      //   } else {
      //     // user role = 1
      //     user.setRoles([1]).then(() => {
      //       res.send({
      //         message:
      //           "You have successfully registered your account. Please log into it using your credentials!",
      //       });
      //     });
      //   }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
  //   };
};

const verifyNewUnlistedWorkout = {
  checkAllDataProvided,
  addUnlistedWorkout,
};

module.exports = verifyNewUnlistedWorkout;
