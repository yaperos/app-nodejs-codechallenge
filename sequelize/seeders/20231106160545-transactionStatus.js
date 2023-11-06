"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "transaction_status",
      [
        {
          transaction_status_id: 1,
          name: "PENDING",
        },
        {
          transaction_status_id: 2,
          name: "APPROVED",
        },
        {
          transaction_status_id: 3,
          name: "REJECTED",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transaction_status", null, {});
  },
};
