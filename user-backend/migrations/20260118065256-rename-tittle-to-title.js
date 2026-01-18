'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Messages', 'tittle', 'title');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('Messages', 'title', 'tittle');
  }
};
