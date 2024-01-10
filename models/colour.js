module.exports = (sequelize, Sequelize) => {
    const Colour = sequelize.define("Colour", {
        name: Sequelize.STRING,
      },
      {
        timestamps: false,
      }
    );
  
    Colour.associate = function (models) {
      Colour.hasMany(models.Vehicle, { foreignKey: "colourId", as: "vehicle" });
    };
  
    return Colour;
  };