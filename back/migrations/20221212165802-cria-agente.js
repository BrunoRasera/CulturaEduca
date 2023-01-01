'use strict';

const tableName = 'agente';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      endereco_id: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'endereco',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      telefone1: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      telefone2: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      site: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      atua_desde_ano: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      area_atuacao_outros: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      abrangencia_geografica: {
        type: Sequelize.ENUM([
          'LOCAL',
          'MUNICIPAL',
          'INTERMUNICIPAL',
          'ESTADUAL',
          'NACIONAL',
        ]),
      },
      historico: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT,
      },
      objetivo: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      created_by: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuario',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      updated_by: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuario',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
