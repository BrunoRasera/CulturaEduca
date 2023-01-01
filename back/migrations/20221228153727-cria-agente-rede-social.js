'use strict';

const tableName = 'agente_rede_social';

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
      plataforma: {
        allowNull: false,
        type: Sequelize.ENUM([
          'FACEBOOK',
          'INSTAGRAM',
          'LINKEDIN',
          'OUTROS',
          'TIKTOK',
          'TWITTER',
          'YOUTUBE',
        ]),
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
