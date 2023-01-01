/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'usuario',
      [
        {
          st_id: uuidv4(),
          nome: process.env.USUARIO_ADMIN_NOME,
          sobrenome: process.env.USUARIO_ADMIN_SOBRENOME,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('usuario', null, {});
  },
};
