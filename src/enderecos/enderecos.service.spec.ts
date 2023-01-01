import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { EnderecosService } from './enderecos.service';
import { Endereco } from '@/models';

const moduleMocker = new ModuleMocker(global);

describe('EnderecosService', () => {
  let service: EnderecosService;
  let enderecoModelMock: typeof Endereco;

  beforeEach(async () => {
    enderecoModelMock = createMock<typeof Endereco>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [EnderecosService],
    })
      .useMocker((token) => {
        if (token === getModelToken(Endereco)) {
          return enderecoModelMock;
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

    service = module.get<EnderecosService>(EnderecosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
