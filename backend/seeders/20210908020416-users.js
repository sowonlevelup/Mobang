'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * npx sequelize seed:generate --name user
     * 
     * 
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert("users", [
      {
        id: 10,
        name: "test1",
        email: "tes2t@test.com",
        password: "@!DKJ@#!JK!@KJ132",
        profile: "test",
        type:"test",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      }]);
  },
  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
