'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sentiments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      batch_id: {
        type: Sequelize.INTEGER
      },
      text: {
        type: Sequelize.TEXT
      },
      tokens: {
        type: Sequelize.JSON
      },
      positive_text: {
        type: Sequelize.JSON
      },
      negative_text: {
        type: Sequelize.JSON
      },
      score: {
        type: Sequelize.INTEGER
      },
      comparative: {
        type: Sequelize.DOUBLE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sentiments');
  }
};