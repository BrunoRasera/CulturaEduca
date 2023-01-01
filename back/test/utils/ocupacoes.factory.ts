import { faker } from '@faker-js/faker/locale/pt_BR';

import { Ocupacao } from '@/models';

export const generateFakeOcupacao = (outros = false) => {
  return {
    nome: faker.random.word(),
    outros,
  };
};

export const ocupacaoBulkCreate = async (
  ocupacaoModel: typeof Ocupacao,
  n: number,
) => {
  const ocupacoes = [];
  for (let i = 0; i < n; i++) {
    ocupacoes.push(generateFakeOcupacao());
  }
  return ocupacaoModel.bulkCreate(ocupacoes);
};

export const ocupacaoCreate = async (
  ocupacaoModel: typeof Ocupacao,
  outros = false,
) => {
  return ocupacaoModel.create(generateFakeOcupacao(outros));
};
