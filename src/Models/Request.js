const Sequelize = require('sequelize');
const sequelize = require('./db');
const User = require('./User');
const Project = require('./Project');
const City = require('./City');
const RequestStatus = require('./RequestStatus');
//const Quote = require('./Quote');


const Request = sequelize.define('request', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    requestedOn: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    requestedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        }
    },
    requestStatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
        references: {
            model: RequestStatus,
            key: 'id',
        }
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Project,
            key: 'id',
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    originCityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: City,
            key: 'id',
        }
    },
    destinationCityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: City,
            key: 'id',
        }
    },
    isRoundTrip: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    travelDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    returnDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    isHotelNeeded: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    checkInDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    checkOutDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    /*selectedQuoteId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: Quote,
            key: 'id',
        }
    },*/
    justification: {
        type: Sequelize.TEXT,
        allowNull: true,
    }
}, {
    timestamps: false,
});

Request.belongsTo(User, { foreignKey: 'requestedBy', onDelete: 'RESTRICT'});
Request.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'RESTRICT' });
Request.belongsTo(City, { foreignKey: 'originCityId', as: 'OriginCity', onDelete: 'RESTRICT' });
Request.belongsTo(City, { foreignKey: 'destinationCityId', as: 'DestinationCity', onDelete: 'RESTRICT' });
Request.belongsTo(RequestStatus, { foreignKey: 'requestStatusId', onDelete: 'RESTRICT' });
//Request.belongsTo(Quote, { foreignKey: 'selectedQuoteId', onDelete: 'RESTRICT' });

User.hasMany(Request, { foreignKey: 'requestedBy' });
Project.hasMany(Request, { foreignKey: 'projectId' });
City.hasMany(Request, { foreignKey: 'originCityId', as: 'OriginRequests' });
City.hasMany(Request, { foreignKey: 'destinationCityId', as: 'DestinationRequests' });
RequestStatus.hasMany(Request, { foreignKey: 'requestStatusId' });
//Quote.hasOne(Request, { foreignKey: 'selectedQuoteId' });


module.exports = Request;
