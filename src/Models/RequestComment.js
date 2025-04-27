const Sequelize = require('sequelize');
const sequelize = require('./db');

const User = require('./User');
const Request = require('./Request');

const RequestComment = sequelize.define(
    'requestcomment',
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
        commentBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        commentOn: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

RequestComment.belongsTo(Request, { foreignKey: 'requestId' });
RequestComment.belongsTo(User, { foreignKey: 'commentBy' });
Request.hasMany(RequestComment, { foreignKey: 'requestId' });
User.hasMany(RequestComment, { foreignKey: 'userId' });

module.exports = RequestComment;
