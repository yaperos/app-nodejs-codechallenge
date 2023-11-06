"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "transaction_types",
      [
        {
          transaction_type_id: 1,
          name: "WITHDRAWAL",
        },
        {
          transaction_type_id: 2,
          name: "DEPOSIT",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transaction_types", null, {});
  },
};
