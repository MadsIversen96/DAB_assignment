module.exports = (sequelize, Sequelize) => {
    const Type = sequelize.define("Type", {
        name: Sequelize.STRING,
      },
      { timestamps: false,}
    );
  
    Type.associate = function (models) {
      Type.hasMany(models.Vehicle, { foreignKey: "typeId", as: "vehicle" });
    };
  
    return Type;
  };