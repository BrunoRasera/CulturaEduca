import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { AreasEstudoController } from './areas-estudo.controller';
import { AreasEstudoService } from './areas-estudo.service';

const moduleMocker = new ModuleMocker(global);

describe('AreasEstudoController', () => {
  let controller: AreasEstudoController;
  let areasEstudoServiceMock: AreasEstudoService;

  beforeEach(async () => {
    areasEstudoServiceMock = createMock<AreasEstudoService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasEstudoController],
    })
      .useMocker((token) => {
        if (token === AreasEstudoService) {
          return areasEstudoServiceMock;
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

    controller = module.get<AreasEstudoController>(AreasEstudoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista deve chamar o service de busca', async () => {
    await controller.lista();
    expect(areasEstudoServiceMock.lista).toHaveBeenCalled();
  });
});
