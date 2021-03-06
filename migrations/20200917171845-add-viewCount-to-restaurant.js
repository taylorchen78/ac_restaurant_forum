'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Restaurants', 'viewCounts', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Restaurants', 'viewCounts');
  }
};
