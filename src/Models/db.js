var Sequelize = require('sequelize'); //import sequelize
const sequelize = new Sequelize(
    'travelup', // database name
    'postgres', // database user
    '1230', // database password
    {
        host: 'localhost', // Host where the database is running
        port: '5432', // Default port for PostgreSQL
        dialect: 'postgres' // Specifies the type of database (PostgreSQL in this case)
    }
)

module.exports = sequelize; // Export the sequelize instance for use in other files