'use strict';

const tableName = 'rel_agente_area_estudo';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      agente_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'agente',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      area_estudo_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'area_estudo',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
