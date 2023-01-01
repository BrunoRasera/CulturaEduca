import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { PublicosFocaisService } from './publicos-focais.service';
import { PublicoFocal } from '@/models';

const moduleMocker = new ModuleMocker(global);

describe('PublicosFocaisService', () => {
  let service: PublicosFocaisService;
  let publicoFocalModelMock: typeof PublicoFocal;

  beforeEach(async () => {
    publicoFocalModelMock = createMock<typeof PublicoFocal>({
      findAll: jest
        .fn()
        .mockReturnValue(
          [...new Array(10)].map(() => createMock<PublicoFocal>()),
        ),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicosFocaisService],
    })
      .useMocker((token) => {
        if (token === getModelToken(PublicoFocal)) {
          return publicoFocalModelMock;
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

    service = module.get<PublicosFocaisService>(PublicosFocaisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista públicos focais deve retornar um array', async () => {
    const publicosFocais = await service.lista();
    expect(publicoFocalModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(publicosFocais)).toBe(true);
    expect(publicosFocais[0]).toHaveProperty('id');
    expect(publicosFocais[0]).toHaveProperty('nome');
  });
});
