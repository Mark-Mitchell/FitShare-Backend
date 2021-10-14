const db = require("../models");
const UnlistedWorkout = db.unlistedWorkout;
const User = db.user;

exports.unlistedWorkoutBoardSuccess = async (req, res) => {
  const user = await User.findByPk(req.body.userId);
  res.status(200).send({
    message: "SUCCESS - Workout created",
    slug: req.slug,
    creator: req.body.userId,
    creatorUsername: user.username,
  });
};

exports.unlistedWorkoutBoard = async (req, res) => {
  const slug = req.body.slug.toLowerCase();
  const workout = await UnlistedWorkout.findOne({
    where: { slug: slug },
  });
  const user = await User.findByPk(workout.userId);
  if (workout) {
    res.status(200).send({
      message: "SUCCESS - FETCHED",
      workout: { ...workout.dataValues, creatorUsername: user.username },
    });
  } else {
    res.status(404).send({
      message: "ERROR - There is no workout with this ID. (InvalidID)",
    });
  }
};

exports.deleteWorkout = async (req, res) => {
  UnlistedWorkout.destroy({ where: { slug: req.body.slug } });
  return res.status(200).send({ message: "SUCCESS - Workout deleted." });
};
