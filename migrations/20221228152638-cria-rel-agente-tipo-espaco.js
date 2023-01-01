'use strict';

const tableName = 'rel_agente_tipo_espaco';

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
      tipo_espaco_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tipo_espaco',
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
