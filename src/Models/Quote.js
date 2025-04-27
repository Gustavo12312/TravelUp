const Sequelize = require('sequelize');
const sequelize = require('./db');
const Request = require('./Request'); 
const Agency = require('./Agency');

const Quote = sequelize.define(
    'quote',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        requestId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Request,
                key: 'id',
            },
        },
        agencyId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: Agency, 
                key: 'id',
            },
        },
        isSelected: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    },
    {
        timestamps: false,
        /*
        indexes: [
            {
                unique: true,
                fields: ['requestId', 'isSelected'],
            }
        ]
        */
    }
);

Quote.belongsTo(Request, { foreignKey: 'requestId' });
Quote.belongsTo(Agency, { foreignKey: 'agencyId' });
Request.hasMany(Quote, { foreignKey: 'requestId' });
Agency.hasMany(Quote, { foreignKey: 'agencyId' });

module.exports = Quote;
