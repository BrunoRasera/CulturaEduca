'use strict';

const tableName = 'rel_agente_publico_focal';

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
      publico_focal_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'publico_focal',
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
