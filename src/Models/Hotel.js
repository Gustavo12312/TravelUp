const Sequelize = require('sequelize');
const sequelize = require('./db');
const City = require('./City');

const Hotel = sequelize.define(
    'hotel',
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


Hotel.belongsTo(City, { foreignKey: 'cityId' });
City.hasMany(Hotel, { foreignKey: 'cityId' });

module.exports = Hotel;
