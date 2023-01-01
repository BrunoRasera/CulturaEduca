'use strict';

const tableName = 'usuario';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(tableName, 'agente_id', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.INTEGER,
      references: {
        model: 'agente',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(tableName, 'agente_id');
  },
};
