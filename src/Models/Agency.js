const Sequelize = require('sequelize');
const sequelize = require('./db');

const Agency = sequelize.define(
    'agency',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        timestamps: false,
    }
);

module.exports = Agency;
