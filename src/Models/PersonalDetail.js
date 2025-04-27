const Sequelize = require('sequelize');
const sequelize = require('./db');
const User = require('./User');

const PersonalDetail = sequelize.define(
    'personaldetail',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        birthdate:{
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        phone: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        passportnumber: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        emergencycontact: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        photo: { 
            type: Sequelize.STRING,
            allowNull: true,
        },
        milescard: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    },
    {
        timestamps: false,
    }
);

PersonalDetail.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(PersonalDetail, { foreignKey: 'userId' });

module.exports = PersonalDetail;
