import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { TiposEspacosController } from './tipos-espacos.controller';
import { TiposEspacosService } from './tipos-espacos.service';

const moduleMocker = new ModuleMocker(global);

describe('TiposEspacosController', () => {
  let controller: TiposEspacosController;
  let tiposEspacosServiceMock: TiposEspacosService;

  beforeEach(async () => {
    tiposEspacosServiceMock = createMock<TiposEspacosService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposEspacosController],
    })
      .useMocker((token) => {
        if (token === TiposEspacosService) {
          return tiposEspacosServiceMock;
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

    controller = module.get<TiposEspacosController>(TiposEspacosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista deve chamar o service de busca', async () => {
    await controller.lista();
    expect(tiposEspacosServiceMock.lista).toHaveBeenCalled();
  });
});
