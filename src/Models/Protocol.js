const Sequelize = require('sequelize');
const sequelize = require('./db');
const Hotel = require('./Hotel');

const Protocol = sequelize.define(
    'protocol',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        hotelId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true, 
            references: {
                model: Hotel,
                key: 'id',
            },
        },
        discountRate: {
            type: Sequelize.FLOAT, 
            allowNull: false,
            validate: {
                min: 0,
                max: 100,
            },
        },
        procedure: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

Protocol.belongsTo(Hotel, { foreignKey: 'hotelId' });
Hotel.hasOne(Protocol, { foreignKey: 'hotelId' });


module.exports = Protocol;
