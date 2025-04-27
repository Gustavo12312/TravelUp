const Sequelize = require('sequelize');
const sequelize = require('./db');
const Quote = require('./Quote');
const Airport = require('./Airport');

const QuoteFlight = sequelize.define(
    'quoteflight',
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
        flightNumber: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        departureAirportId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Airport,
                key: 'id',
            },
        },
        arrivalAirportId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Airport,
                key: 'id',
            },
        },
        departureDateTime: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        arrivalDateTime: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        price: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        isReturnTrip: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        hasStops: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        timestamps: false,
    }
);

QuoteFlight.belongsTo(Quote, { foreignKey: 'quoteId' });
QuoteFlight.belongsTo(Airport, { foreignKey: 'departureAirportId', as: 'DepartureAirport' });
QuoteFlight.belongsTo(Airport, { foreignKey: 'arrivalAirportId', as: 'ArrivalAirport' });
Airport.hasMany(QuoteFlight, { foreignKey: 'departureAirportId', as: 'DepartingFlights' });
Airport.hasMany(QuoteFlight, { foreignKey: 'arrivalAirportId', as: 'ArrivingFlights' });
Quote.hasMany(QuoteFlight, { foreignKey: 'quoteId' });


module.exports = QuoteFlight;
