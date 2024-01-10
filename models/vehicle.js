module.exports = (sequelize, Sequelize) => {
    const Vehicle = sequelize.define("Vehicle", {
        regNo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        make: Sequelize.STRING,
        model: Sequelize.STRING,
        lastServiceDate: Sequelize.DATE,
        rented: Sequelize.BOOLEAN,
        
    }, {timestamps: false})
    Vehicle.associate = function(models) {
        Vehicle.hasMany(models.Rental, { foreignKey: "vehicleId", as: "rental" });
        Vehicle.belongsToMany(models.Feature, {
            through: "VehicleFeatures",
            timestamps: false,
          });
          Vehicle.belongsTo(models.Type, { foreignKey: "typeId", as: "type" });
          Vehicle.belongsTo(models.Colour, { foreignKey: "colourId", as: "colour" });
    };
    return Vehicle;
}