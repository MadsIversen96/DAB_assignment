module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("User", {
        fullName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        roleId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Roles",
              key: "id",
            },
            defaultValue: 2,
          }
        
    }, {timestamps: false})
    User.associate = function(models) {
        User.belongsTo(models.Role, {foreignKey: 'roleId', as: 'role'});
        User.hasMany(models.Rental, { foreignKey: 'userId', as: 'rental' });
    };
    return User;
}