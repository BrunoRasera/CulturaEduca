import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { AreasAtuacaoController } from './areas-atuacao.controller';
import { AreasAtuacaoService } from './areas-atuacao.service';

const moduleMocker = new ModuleMocker(global);

describe('AreasAtuacaoController', () => {
  let controller: AreasAtuacaoController;
  let areasAtuacaoServiceMock: AreasAtuacaoService;

  beforeEach(async () => {
    areasAtuacaoServiceMock = createMock<AreasAtuacaoService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AreasAtuacaoController],
    })
      .useMocker((token) => {
        if (token === AreasAtuacaoService) {
          return areasAtuacaoServiceMock;
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

    controller = module.get<AreasAtuacaoController>(AreasAtuacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista deve chamar o service de busca', async () => {
    await controller.lista();
    expect(areasAtuacaoServiceMock.lista).toHaveBeenCalled();
  });
});
