const Sequelize = require('sequelize');
const sequelize=require('./db');
const bcrypt = require('bcrypt');
const Role = require('./Role')

var User = sequelize.define(
    'user', 
    {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Role,
            key: 'id',
        },
    },
});

User.beforeCreate ((user, options) => {
    return bcrypt.hash (user.password, 10) 
    .then (hash => {
        user.password= hash;
    })
    .catch (err => {
        throw new Error();
    });
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

module.exports = User;