import { faker } from '@faker-js/faker/locale/pt_BR';

import { Escolaridade } from '@/models';

export const generateFakeEscolaridade = () => {
  return {
    nome: faker.random.word(),
  };
};

export const escolaridadeBulkCreate = async (
  escolaridadeModel: typeof Escolaridade,
  n: number,
) => {
  const escolaridades = [];
  for (let i = 0; i < n; i++) {
    escolaridades.push(generateFakeEscolaridade());
  }
  return escolaridadeModel.bulkCreate(escolaridades);
};

export const escolaridadeCreate = async (
  escolaridadeModel: typeof Escolaridade,
) => {
  return escolaridadeModel.create(generateFakeEscolaridade());
};
