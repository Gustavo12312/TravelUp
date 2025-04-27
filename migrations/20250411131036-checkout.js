'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
      await queryInterface.changeColumn('quotehotels', 'checkOutDate', {
        type: Sequelize.DATEONLY
      });
    }
}

