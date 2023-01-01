import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { TiposEspacosService } from './tipos-espacos.service';
import { TipoEspaco } from '@/models';

const moduleMocker = new ModuleMocker(global);

describe('TiposEspacosService', () => {
  let service: TiposEspacosService;
  let tipoEspacoModelMock: typeof TipoEspaco;

  beforeEach(async () => {
    tipoEspacoModelMock = createMock<typeof TipoEspaco>({
      findAll: jest
        .fn()
        .mockReturnValue(
          [...new Array(10)].map(() => createMock<TipoEspaco>()),
        ),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [TiposEspacosService],
    })
      .useMocker((token) => {
        if (token === getModelToken(TipoEspaco)) {
          return tipoEspacoModelMock;
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

    service = module.get<TiposEspacosService>(TiposEspacosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista tipos de espaço deve retornar um array', async () => {
    const tiposEspacos = await service.lista();
    expect(tipoEspacoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(tiposEspacos)).toBe(true);
    expect(tiposEspacos[0]).toHaveProperty('id');
    expect(tiposEspacos[0]).toHaveProperty('nome');
  });
});
