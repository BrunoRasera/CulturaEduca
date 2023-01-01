import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { AreasEstudoService } from './areas-estudo.service';
import { AreaEstudo } from '@/models';

const moduleMocker = new ModuleMocker(global);

describe('AreasEstudoService', () => {
  let service: AreasEstudoService;
  let areaEstudoModelMock: typeof AreaEstudo;

  beforeEach(async () => {
    areaEstudoModelMock = createMock<typeof AreaEstudo>({
      findAll: jest
        .fn()
        .mockReturnValue(
          [...new Array(10)].map(() => createMock<AreaEstudo>()),
        ),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [AreasEstudoService],
    })
      .useMocker((token) => {
        if (token === getModelToken(AreaEstudo)) {
          return areaEstudoModelMock;
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

    service = module.get<AreasEstudoService>(AreasEstudoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista áreas de estudo deve retornar um array', async () => {
    const areasEstudo = await service.lista();
    expect(areaEstudoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(areasEstudo)).toBe(true);
    expect(areasEstudo[0]).toHaveProperty('id');
    expect(areasEstudo[0]).toHaveProperty('nome');
  });
});
