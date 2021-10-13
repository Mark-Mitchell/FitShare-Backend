const { authJwt, verifyNewUnlistedWorkout } = require("../middleware");
const controller = require("../controllers/unlistedWorkouts.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/unlistedWorkout/upload",
    [
      authJwt.verifyToken,
      verifyNewUnlistedWorkout.checkAllDataProvided,
      verifyNewUnlistedWorkout.addUnlistedWorkout,
    ],
    controller.unlistedWorkoutBoardSuccess
  );

  app.post(
    "/api/unlistedWorkout/download",
    [authJwt.verifyToken, verifyNewUnlistedWorkout.checkId],
    controller.unlistedWorkoutBoard
  );

  app.post(
    "/api/unlistedWorkout/delete",
    [authJwt.verifyToken, verifyNewUnlistedWorkout.checkDeleteData],
    controller.deleteWorkout
  );
};
