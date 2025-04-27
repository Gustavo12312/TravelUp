const Sequelize = require('sequelize');
const sequelize = require('./db');
const City = require('./City'); 

const Airport = sequelize.define(
    'airport',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        cityId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: City,
                key: 'id',
            },
        },
    },
    {
        timestamps: false,
    }
);

Airport.belongsTo(City, { foreignKey: 'cityId' });
City.hasMany(Airport, { foreignKey: 'cityId' });

module.exports = Airport;
