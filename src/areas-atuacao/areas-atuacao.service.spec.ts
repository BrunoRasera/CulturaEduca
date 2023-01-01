import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { AreasAtuacaoService } from './areas-atuacao.service';
import { AreaAtuacao } from '@/models';

const moduleMocker = new ModuleMocker(global);

describe('AreasAtuacaoService', () => {
  let service: AreasAtuacaoService;
  let areaAtuacaoModelMock: typeof AreaAtuacao;

  beforeEach(async () => {
    areaAtuacaoModelMock = createMock<typeof AreaAtuacao>({
      findAll: jest
        .fn()
        .mockReturnValue(
          [...new Array(10)].map(() => createMock<AreaAtuacao>()),
        ),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [AreasAtuacaoService],
    })
      .useMocker((token) => {
        if (token === getModelToken(AreaAtuacao)) {
          return areaAtuacaoModelMock;
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

    service = module.get<AreasAtuacaoService>(AreasAtuacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * lista()
   */

  it('lista áreas de atuação deve retornar um array', async () => {
    const areasAtuacao = await service.lista();
    expect(areaAtuacaoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(areasAtuacao)).toBe(true);
    expect(areasAtuacao[0]).toHaveProperty('id');
    expect(areasAtuacao[0]).toHaveProperty('nome');
    expect(areasAtuacao[0]).toHaveProperty('outros');
  });
});
