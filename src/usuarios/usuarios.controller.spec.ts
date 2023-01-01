import { Test, TestingModule } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { createMock } from '@golevelup/ts-jest';
import { faker } from '@faker-js/faker/locale/pt_BR';

import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { AtualizaUsuarioDto, CriaUsuarioDto } from './dto';

const moduleMocker = new ModuleMocker(global);

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let usuariosServiceMock: UsuariosService;

  beforeEach(async () => {
    usuariosServiceMock = createMock<UsuariosService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
    })
      .useMocker((token) => {
        if (token === UsuariosService) {
          return usuariosServiceMock;
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

    controller = module.get<UsuariosController>(UsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * busca(usuarioId: number)
   */

  it('busca deve chamar o service de busca', async () => {
    const usuarioId = 1;
    await controller.busca(usuarioId);
    expect(usuariosServiceMock.busca).toHaveBeenCalledWith(usuarioId);
  });

  /**
   * lista()
   */

  it('lista deve chamar o service de busca', async () => {
    await controller.lista();
    expect(usuariosServiceMock.lista).toHaveBeenCalled();
  });

  /**
   * cria()
   */
  it('cria deve chamar o service de cria', async () => {
    const dto: CriaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    await controller.cria(dto);
    expect(usuariosServiceMock.cria).toHaveBeenCalledWith(dto);
  });

  /**
   * atualiza()
   */
  it('atualiza deve chamar o service de atualiza', async () => {
    const dto: AtualizaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    const usuarioId = 1;
    await controller.atualiza(usuarioId, dto);
    expect(usuariosServiceMock.atualiza).toHaveBeenCalledWith(usuarioId, dto);
  });

  /**
   * remove()
   */
  it('remove deve chamar o service de remove', async () => {
    const usuarioId = 1;
    await controller.remove(usuarioId);
    expect(usuariosServiceMock.remove).toHaveBeenCalledWith(usuarioId);
  });
});
