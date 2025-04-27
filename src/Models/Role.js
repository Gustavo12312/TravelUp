const Sequelize = require('sequelize');
const sequelize = require('./db');

const Role = sequelize.define(
    'role', 
    {
    id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    label: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true 
    }
});

Role.sync({ force: false })
    .then(() => {
        return Role.bulkCreate([
            { id: 1, label: 'Traveler' },
            { id: 2, label: 'Facilitator' },
            { id: 3, label: 'Manager' }
        ], {
            ignoreDuplicates: true
        });
    })
    .catch((error) => console.error("Error syncing Role model:", error));

module.exports = Role;
