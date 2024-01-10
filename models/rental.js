module.exports = (sequelize, Sequelize) => {
    const Rental = sequelize.define("Rental", {
      },
      { timestamps: false, }
    );
    Rental.associate = function (models) {
      Rental.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Rental.belongsTo(models.Vehicle, { foreignKey: "vehicleId", as: "vehicle" });
    };
  
    return Rental;
  };