'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ideas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      thumbnail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      budget: {
        allowNull: false,
        type: Sequelize.STRING
      },
      totalFund: {
        defaultValue: 0,
        type: Sequelize.STRING
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      isApproved: {
        type: Sequelize.ENUM(["approved", "pending", "rejected"]),
        defaultValue: "pending"
      },
      note: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Ideas');
  }
};