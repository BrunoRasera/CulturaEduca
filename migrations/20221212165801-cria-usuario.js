'use strict';

const tableName = 'usuario';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      st_id: {
        allowNull: false,
        type: Sequelize.UUID,
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
        onDelete: 'SET NULL',
      },
      etnia_id: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'etnia',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      ocupacao_id: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'ocupacao',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      escolaridade_id: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.INTEGER,
        references: {
          model: 'escolaridade',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sobrenome: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      identidade_genero: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.ENUM([
          'MULHER_CIS',
          'HOMEM_CIS',
          'MULHER_TRANS',
          'HOMEM_TRANS',
          'NAO_BINARIO',
        ]),
      },
      raca_cor_ibge: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.ENUM([
          'NAO_INFORMAR',
          'AMARELA',
          'BRANCA',
          'INDIGENA',
          'PARDA',
          'PRETA',
        ]),
      },
      etnia_outros: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
      },
      ocupacao_outros: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING,
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
