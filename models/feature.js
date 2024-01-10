module.exports = (sequelize, Sequelize) => {
    const Feature = sequelize.define("Feature", {
        name: Sequelize.STRING,
      },
      { timestamps: false, }
    );
    Feature.associate = function (models) {
      Feature.belongsToMany(models.Vehicle, {
        through: "VehicleFeatures",
        timestamps: false,
      });
    };
    return Feature;
  };