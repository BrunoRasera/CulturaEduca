'use strict';

const tableName = 'endereco';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      logradouro: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      numero: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      complemento: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      bairro: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      codigo_postal: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      municipio_nome: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      municipio_ibge: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      uf_nome: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      uf_sigla: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      pais_nome: {
        allowNull: false,
        defaultValue: 'Brasil',
        type: Sequelize.STRING,
      },
      pais_iso3: {
        allowNull: false,
        defaultValue: 'BRA',
        type: Sequelize.STRING,
      },
      geom: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.GEOMETRY('POINT', 4326),
      },
      created_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable(tableName);
  },
};
