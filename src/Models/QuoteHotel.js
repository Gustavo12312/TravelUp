const Sequelize = require('sequelize');
const sequelize = require('./db');
const Quote = require('./Quote'); 
const Hotel = require('./Hotel');

const QuoteHotel = sequelize.define(
    'quotehotel',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quoteId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Quote,
                key: 'id',
            },
        },
        hotelId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Hotel,
                key: 'id',
            },
        },
        checkInDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        checkOutDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        pricePerNight: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
    },
    {
        timestamps: false,
    }
);

QuoteHotel.belongsTo(Quote, { foreignKey: 'quoteId' });
QuoteHotel.belongsTo(Hotel, { foreignKey: 'hotelId' });
Quote.hasMany(QuoteHotel, { foreignKey: 'quoteId' });
Hotel.hasMany(Quote, { foreignKey: 'hotelId' });

module.exports = QuoteHotel;
