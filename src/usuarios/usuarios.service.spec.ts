import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { Usuario } from '@/models';
import { CriaUsuarioDto, AtualizaUsuarioDto } from './dto';
import { UsuariosService } from './usuarios.service';
import { createMock } from '@golevelup/ts-jest';

const moduleMocker = new ModuleMocker(global);

describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuarioModelMock: typeof Usuario;

  beforeEach(async () => {
    // mock usuarioModel
    usuarioModelMock = createMock<typeof Usuario>({
      create: jest.fn().mockImplementation((usuarioData) => {
        return createMock<Usuario>({
          id: 1,
          ...usuarioData,
        });
      }),
      findAll: jest.fn().mockResolvedValue([]),
      findByPk: jest.fn().mockImplementation((id) => {
        if (id <= 0) return null;
        return createMock<Usuario>({ id });
      }),
    });
    // usuarioModelMock = createMock<typeof Usuario>({
    //   create: jest.fn().mockImplementation((usuarioData) => {
    //     return createMock<Usuario>({ ...usuarioData });
    //   }),
    //   findAll: jest
    //     .fn()
    //     .mockResolvedValue([...new Array(10)].map(() => createMock<Usuario>())),
    //   findByPk: jest.fn().mockImplementation((id) => {
    //     if (id <= 0) return null;
    //     return createMock<Usuario>({ id });
    //   }),
    // });

    // test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosService],
    })
      .useMocker((token) => {
        if (token === getModelToken(Usuario)) {
          return usuarioModelMock;
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * busca(usuarioId: number)
   */

  it('busca usuário deve jogar NotFoundException para usuário não encontrado', async () => {
    const usuarioId = 0;
    try {
      await service.busca(usuarioId);
      throw new Error('Não deveria chegar aqui');
    } catch (err) {
      expect(usuarioModelMock.findByPk).toHaveBeenCalledWith(usuarioId);
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Usuário não encontrado');
    }
  });

  it('busca usuário deve retornar um usuário para id existente', async () => {
    const usuarioId = 1;
    const usuario = await service.busca(usuarioId);
    expect(usuarioModelMock.findByPk).toHaveBeenCalledWith(usuarioId);
    expect(typeof usuario).toBe('object');
    expect(usuario.id).toBe(usuarioId);
  });

  /**
   * lista()
   */

  it('lista usuários deve retornar um array', async () => {
    const usuarios = await service.lista();
    expect(usuarioModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(usuarios)).toBe(true);
  });

  /**
   * cria(dto)
   */

  it('cria usuário deve chamar a função de criar do sequelize', async () => {
    const dto: CriaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    await service.cria(dto);
    expect(usuarioModelMock.create).toBeCalled();
  });

  it('cria usuário deve retornar um usuário com os dados que vieram do dto', async () => {
    const dto: CriaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    const usuario = await service.cria(dto);
    expect(usuario.nome).toBe(dto.nome);
    expect(usuario.sobrenome).toBe(dto.sobrenome);
  });

  it('cria usuário deve retornar uma instância de usuário', async () => {
    const dto: CriaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    const usuario = await service.cria(dto);
    expect(usuario.id).toBeDefined();
    expect(usuario.id).toBeGreaterThanOrEqual(1);
    expect(usuario.nome).toBeDefined();
    expect(usuario.sobrenome).toBeDefined();
    expect(usuario.createdAt).toBeDefined();
    expect(usuario.updatedAt).toBeDefined();
  });

  /**
   * atualiza()
   */

  it('atualiza usuário deve chamar a função update de usuário os dados que vieram do dto', async () => {
    const usuarioId = 1;
    const dto: AtualizaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    const usuario = await service.atualiza(usuarioId, dto);
    expect(usuario.update).toHaveBeenCalledWith(dto);
  });

  /**
   * remove()
   */

  it('remove usuario deve retornar o usuario removido', async () => {
    const usuarioId = 1;
    const usuario = await service.remove(usuarioId);
    expect(usuario.id).toBe(usuarioId);
  });

  it('remove usuário deve jogar NotFoundException para usuário não encontrado', async () => {
    const usuarioId = 0;
    try {
      await service.remove(usuarioId);
      throw new Error('Não deveria chegar aqui');
    } catch (err) {
      expect(usuarioModelMock.findByPk).toHaveBeenCalledWith(usuarioId);
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Usuário não encontrado');
    }
  });
});
