import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

import { AgentesController } from './agentes.controller';
import { AgentesService } from './agentes.service';
import { CriaPessoaFisicaDto } from './dto';
import { geraCriaPessoaFisicaDto } from '@/../test/utils/agentes.factory';

const moduleMocker = new ModuleMocker(global);

describe('AgentesController', () => {
  let controller: AgentesController;
  let agentesServiceMock: AgentesService;

  beforeEach(async () => {
    agentesServiceMock = createMock<AgentesService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentesController],
    })
      .useMocker((token) => {
        if (token === AgentesService) {
          return agentesServiceMock;
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

    controller = module.get<AgentesController>(AgentesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * criaPessoaFisica()
   */

  it('criaPessoaFisica deve chamar o service de criaPessoaFisica', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    const usuarioId = 1;
    await controller.criaPessoaFisica(dto, usuarioId);
    expect(agentesServiceMock.criaPessoaFisica).toHaveBeenCalledWith(
      dto,
      usuarioId,
    );
  });
});
