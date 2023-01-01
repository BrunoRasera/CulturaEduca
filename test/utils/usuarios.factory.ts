import { faker } from '@faker-js/faker/locale/pt_BR';
import { v4 as uuidv4 } from 'uuid';

import { Usuario } from '@/models';

export const generateFakeUsuario = () => {
  return {
    stId: uuidv4(),
    nome: faker.name.firstName(),
    sobrenome: faker.name.lastName(),
  };
};

export const usuarioBulkCreate = async (
  usuarioModel: typeof Usuario,
  n: number,
) => {
  const usuarios = [];
  for (let i = 0; i < n; i++) {
    usuarios.push(generateFakeUsuario());
  }
  return usuarioModel.bulkCreate(usuarios);
};

export const usuarioCreate = async (usuarioModel: typeof Usuario) => {
  return usuarioModel.create(generateFakeUsuario());
};
