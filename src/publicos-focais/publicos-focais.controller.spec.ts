import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { PublicosFocaisController } from './publicos-focais.controller';
import { PublicosFocaisService } from './publicos-focais.service';

const moduleMocker = new ModuleMocker(global);

describe('PublicosFocaisController', () => {
  let controller: PublicosFocaisController;
  let publicosFocaisServiceMock: PublicosFocaisService;

  beforeEach(async () => {
    publicosFocaisServiceMock = createMock<PublicosFocaisService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicosFocaisController],
    })
      .useMocker((token) => {
        if (token === PublicosFocaisService) {
          return publicosFocaisServiceMock;
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

    controller = module.get<PublicosFocaisController>(PublicosFocaisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista deve chamar o service de busca', async () => {
    await controller.lista();
    expect(publicosFocaisServiceMock.lista).toHaveBeenCalled();
  });
});
