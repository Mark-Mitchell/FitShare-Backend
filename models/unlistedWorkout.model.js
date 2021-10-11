module.exports = (sequelize, Sequelize) => {
  const UnlistedWorkout = sequelize.define("unlistedWorkout", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    workout: {
      type: Sequelize.TEXT,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
    },
  });

  return UnlistedWorkout;
};
