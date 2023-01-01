import { faker } from '@faker-js/faker/locale/pt_BR';

import { Etnia } from '@/models';

export const generateFakeEtnia = (outros = false) => {
  return {
    nome: faker.random.word(),
    outros,
  };
};

export const etniaBulkCreate = async (etniaModel: typeof Etnia, n: number) => {
  const etnias = [];
  for (let i = 0; i < n; i++) {
    etnias.push(generateFakeEtnia());
  }
  return etniaModel.bulkCreate(etnias);
};

export const etniaCreate = async (etniaModel: typeof Etnia, outros = false) => {
  return etniaModel.create(generateFakeEtnia(outros));
};
