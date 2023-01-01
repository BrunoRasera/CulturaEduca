import { faker } from '@faker-js/faker/locale/pt_BR';

import { AreaEstudo } from '@/models';

export const generateFakeAreaEstudo = () => {
  return {
    nome: faker.random.word(),
  };
};

export const areaEstudoBulkCreate = async (
  areaEstudoModel: typeof AreaEstudo,
  n: number,
) => {
  const areasEstudo = [];
  for (let i = 0; i < n; i++) {
    areasEstudo.push(generateFakeAreaEstudo());
  }
  return areaEstudoModel.bulkCreate(areasEstudo);
};

export const areaEstudoCreate = async (areaEstudoModel: typeof AreaEstudo) => {
  return areaEstudoModel.create(generateFakeAreaEstudo());
};
