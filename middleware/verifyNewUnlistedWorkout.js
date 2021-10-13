const db = require("../models");
const UnlistedWorkout = db.unlistedWorkout;

// const ROLES = db.ROLES;
// const User = db.user;

checkAllDataProvided = (req, res, next) => {
  // check if user provided email, username and pw
  if (!req.body.workout)
    return res
      .status(400)
      .send({ message: "Please provide a workout. (NoWorkout)" });
  if (!req.body.userId)
    return res
      .status(400)
      .send({ message: "Please provide the userId. (NoUserId)" });
  if (req.body.userId !== req.userId)
    return res
      .status(400)
      .send({ message: "Please log in again and then retry. (WrongUserId)" });
  next();
};

addUnlistedWorkout = async (req, res, next) => {
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

  UnlistedWorkout.create({
    workout: req.body.workout,
    userId: req.body.userId,
    slug: slug,
  })
    .then((workout) => {
      next();
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
  //   };
};

checkId = (req, res, next) => {
  if (!req.body.slug)
    return res
      .status(400)
      .send({ message: "ERROR - Please provide a valid ID. (InvalidID)" });
  next();
};

checkDeleteData = (req, res, next) => {
  if (!req.body.slug) {
    return res
      .status(400)
      .send({ message: "ERROR - Please provide a slug. (NoSlug)" });
  }
  if (!req.body.userId) {
    return res
      .status(400)
      .send({ message: "ERROR - Please provide a userId. (NoUserId" });
  }

  UnlistedWorkout.findOne({ where: { slug: req.body.slug } }).then(
    (workout) => {
      if (!workout) {
        return res.status(404).send({
          message: "ERROR - No workout was found under this slug. (WrongSlug)",
        });
      } else {
        req.workout = workout;
        next();
      }
    }
  );
};

const verifyNewUnlistedWorkout = {
  checkAllDataProvided,
  addUnlistedWorkout,
  checkId,
  checkDeleteData,
};

module.exports = verifyNewUnlistedWorkout;
