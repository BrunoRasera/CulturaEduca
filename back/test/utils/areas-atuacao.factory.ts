import { faker } from '@faker-js/faker/locale/pt_BR';

import { AreaAtuacao } from '@/models';

export const generateFakeAreaAtuacao = (outros = false) => {
  return {
    nome: faker.random.word(),
    outros,
  };
};

export const areaAtuacaoBulkCreate = async (
  areaAtuacaoModel: typeof AreaAtuacao,
  n: number,
) => {
  const areasAtuacao = [];
  for (let i = 0; i < n; i++) {
    areasAtuacao.push(generateFakeAreaAtuacao());
  }
  return areaAtuacaoModel.bulkCreate(areasAtuacao);
};

export const areaAtuacaoCreate = async (
  areaAtuacaoModel: typeof AreaAtuacao,
  outros = false,
) => {
  return areaAtuacaoModel.create(generateFakeAreaAtuacao(outros));
};
