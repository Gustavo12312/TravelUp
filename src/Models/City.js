const Sequelize = require('sequelize');
const sequelize = require('./db');

const City = sequelize.define(
    'city',
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
    },
    {
        timestamps: false, 
    }
);

module.exports = City;
