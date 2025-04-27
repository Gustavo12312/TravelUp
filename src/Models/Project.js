const Sequelize = require('sequelize');
const sequelize = require('./db');

const Project = sequelize.define(
    'project',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        budget: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        totalCost: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0, 
        },
        
    },
    {
        timestamps: false,
    }
);

module.exports = Project;
