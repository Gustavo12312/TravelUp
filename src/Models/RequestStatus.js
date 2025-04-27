const Sequelize = require('sequelize');
const sequelize = require('./db');

const RequestStatus = sequelize.define(
    'requeststatus', 
    {
    id: { 
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true },
    label: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        unique: true }
}, 
{ 
    timestamps: false 
});

RequestStatus.sync({ force: false })
.then(() => {
    RequestStatus.bulkCreate([
        { id: 1, label: 'Rejected' },
        { id: 2, label: 'Waiting For Selection' },
        { id: 3, label: 'Draft' },
        { id: 4, label: 'Submitted' },
        { id: 5, label: 'Approved' },
        { id: 6, label: 'Waiting For Approval' },
        { id: 7, label: 'Waiting For Quotes' },
        { id: 8, label: 'Canceled' }
    ], { ignoreDuplicates: true }); 
});

module.exports = RequestStatus;
