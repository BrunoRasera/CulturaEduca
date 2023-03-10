import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { createMock } from '@golevelup/ts-jest';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { faker } from '@faker-js/faker/locale/pt_BR';

import { geraCriaPessoaFisicaDto } from '@/../test/utils/agentes.factory';
import {
  Agente,
  AgenteRedeSocial,
  AreaAtuacao,
  AreaEstudo,
  Escolaridade,
  Etnia,
  Ocupacao,
  PublicoFocal,
  TipoEspaco,
  Usuario,
} from '@/models';
import { AgentesService } from './agentes.service';
import { CriaPessoaFisicaDto } from './dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { PlataformaAgenteRedeSocialEnum } from './agentes.constants';

const moduleMocker = new ModuleMocker(global);

const areaAtuacaoComOutros = 999;
const etniaComOutrosId = 999;
const ocupacaoComOutrosId = 999;
const usuarioComAgenteId = 999;

describe('AgentesService', () => {
  let service: AgentesService;
  let agenteModelMock: typeof Agente;
  let agenteRedeSocialModelMock: typeof AgenteRedeSocial;
  let areaAtuacaoModelMock: typeof AreaAtuacao;
  let areaEstudoModelMock: typeof AreaEstudo;
  let escolaridadeModelMock: typeof Escolaridade;
  let etniaModelMock: typeof Etnia;
  let ocupacaoModelMock: typeof Ocupacao;
  let publicoFocalModelMock: typeof PublicoFocal;
  let tipoEspacoModelMock: typeof TipoEspaco;
  let usuarioModelMock: typeof Usuario;

  beforeEach(async () => {
    // mock usuarioModel
    agenteModelMock = createMock<typeof Agente>();
    agenteRedeSocialModelMock = createMock<typeof AgenteRedeSocial>();
    areaAtuacaoModelMock = createMock<typeof AreaAtuacao>({
      findAll: jest.fn().mockImplementation((options) => {
        const whereIds = options?.where?.id?.[Op.in] || [];
        const areasAtuacao = [];
        whereIds.forEach((whereId) => {
          if (whereId === areaAtuacaoComOutros) {
            areasAtuacao.push(
              createMock<AreaAtuacao>({
                id: whereId,
                outros: true,
              }),
            );
          } else if (whereId > 0) {
            areasAtuacao.push(
              createMock<AreaAtuacao>({
                id: whereId,
                outros: false,
              }),
            );
          }
        });
        return areasAtuacao;
      }),
    });
    areaEstudoModelMock = createMock<typeof AreaEstudo>({
      findAll: jest.fn().mockImplementation((options) => {
        const whereIds = options?.where?.id?.[Op.in] || [];
        return whereIds
          .filter((whereId) => whereId > 0)
          .map((whereId) =>
            createMock<AreaEstudo>({
              id: whereId,
            }),
          );
      }),
    });
    escolaridadeModelMock = createMock<typeof Escolaridade>({
      findByPk: jest.fn().mockImplementation((id) => {
        if (id <= 0) return null;
        return createMock<Escolaridade>();
      }),
    });
    etniaModelMock = createMock<typeof Etnia>({
      findByPk: jest.fn().mockImplementation((id) => {
        if (id <= 0) return null;
        const etnia = createMock<Etnia>();
        etnia.outros = id === etniaComOutrosId ? true : false;
        return etnia;
      }),
    });
    ocupacaoModelMock = createMock<typeof Ocupacao>({
      findByPk: jest.fn().mockImplementation((id) => {
        if (id <= 0) return null;
        const ocupacao = createMock<Ocupacao>();
        ocupacao.outros = id === ocupacaoComOutrosId ? true : false;
        return ocupacao;
      }),
    });
    publicoFocalModelMock = createMock<typeof PublicoFocal>({
      findAll: jest.fn().mockImplementation((options) => {
        const whereIds = options?.where?.id?.[Op.in] || [];
        return whereIds
          .filter((whereId) => whereId > 0)
          .map((whereId) =>
            createMock<PublicoFocal>({
              id: whereId,
            }),
          );
      }),
    });
    tipoEspacoModelMock = createMock<typeof TipoEspaco>({
      findAll: jest.fn().mockImplementation((options) => {
        const whereIds = options?.where?.id?.[Op.in] || [];
        return whereIds
          .filter((whereId) => whereId > 0)
          .map((whereId) =>
            createMock<TipoEspaco>({
              id: whereId,
            }),
          );
      }),
    });
    usuarioModelMock = createMock<typeof Usuario>({
      findByPk: jest.fn().mockImplementation((id) => {
        if (id <= 0) return null;
        const usuario = createMock<Usuario>();
        usuario.agenteId = id === usuarioComAgenteId ? 1 : null;
        return usuario;
      }),
    });

    // test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentesService],
    })
      .useMocker((token) => {
        if (token === getModelToken(Agente)) {
          return agenteModelMock;
        }
        if (token === getModelToken(AgenteRedeSocial)) {
          return agenteRedeSocialModelMock;
        }
        if (token === getModelToken(AreaAtuacao)) {
          return areaAtuacaoModelMock;
        }
        if (token === getModelToken(AreaEstudo)) {
          return areaEstudoModelMock;
        }
        if (token === getModelToken(Escolaridade)) {
          return escolaridadeModelMock;
        }
        if (token === getModelToken(Etnia)) {
          return etniaModelMock;
        }
        if (token === getModelToken(Ocupacao)) {
          return ocupacaoModelMock;
        }
        if (token === getModelToken(PublicoFocal)) {
          return publicoFocalModelMock;
        }
        if (token === getModelToken(TipoEspaco)) {
          return tipoEspacoModelMock;
        }
        if (token === getModelToken(Usuario)) {
          return usuarioModelMock;
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

    service = module.get<AgentesService>(AgentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * criaPessoaFisica(dto, usuarioId)
   * fun????o de criar agente (pessoa f??sica) para um usu??rio
   */

  // busca usuario

  it('[criaPessoaFisica] deve buscar o usuario no banco', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    await service.criaPessoaFisica(dto, usuarioId);
    expect(usuarioModelMock.findByPk).toBeCalledWith(usuarioId);
  });

  it('[criaPessoaFisica] deve dar erro quando usuario j?? tem agente', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    const usuarioId = usuarioComAgenteId;
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(usuarioModelMock.findByPk).toHaveBeenCalledWith(usuarioId);
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Usu??rio j?? tem agente cadastrado');
    }
  });

  // busca etnia

  it('[criaPessoaFisica] deve buscar a etnia no banco se existir no dto', async () => {
    const usuarioId = 1;
    const etniaId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    expect(etniaModelMock.findByPk).toBeCalledWith(etniaId);
  });

  it('[criaPessoaFisica] deve dar erro quando etnia n??o existe', async () => {
    const usuarioId = 1;
    const etniaId = -1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(etniaModelMock.findByPk).toHaveBeenCalledWith(etniaId);
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Etnia n??o encontrada');
    }
  });

  it('[criaPessoaFisica] deve dar erro quando etnia requer campo etniaOutros', async () => {
    const usuarioId = 1;
    const etniaId = etniaComOutrosId;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId, etniaOutros: null },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(etniaModelMock.findByPk).toHaveBeenCalledWith(etniaId);
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Campo "etnia outros" ?? obrigat??rio');
    }
  });

  // busca ocupacao

  it('[criaPessoaFisica] deve buscar a ocupa????o no banco se existir no dto', async () => {
    const usuarioId = 1;
    const ocupacaoId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { ocupacaoId },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    expect(ocupacaoModelMock.findByPk).toBeCalledWith(ocupacaoId);
  });

  it('[criaPessoaFisica] deve dar erro quando ocupa????o n??o existe', async () => {
    const usuarioId = 1;
    const ocupacaoId = -1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { ocupacaoId },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(ocupacaoModelMock.findByPk).toHaveBeenCalledWith(ocupacaoId);
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Ocupa????o n??o encontrada');
    }
  });

  it('[criaPessoaFisica] deve dar erro quando ocupa????o requer campo ocupacaoOutros', async () => {
    const usuarioId = 1;
    const ocupacaoId = ocupacaoComOutrosId;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { ocupacaoId, ocupacaoOutros: null },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(ocupacaoModelMock.findByPk).toHaveBeenCalledWith(ocupacaoId);
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Campo "ocupa????o outros" ?? obrigat??rio');
    }
  });

  // busca escolaridade

  it('[criaPessoaFisica] deve buscar a escolaridade no banco se existir no dto', async () => {
    const usuarioId = 1;
    const escolaridadeId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { escolaridadeId },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    expect(escolaridadeModelMock.findByPk).toBeCalledWith(escolaridadeId);
  });

  it('[criaPessoaFisica] deve dar erro quando escolaridade n??o existe', async () => {
    const usuarioId = 1;
    const escolaridadeId = -1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { escolaridadeId },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(escolaridadeModelMock.findByPk).toHaveBeenCalledWith(
        escolaridadeId,
      );
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Escolaridade n??o encontrada');
    }
  });

  // agente

  it('[criaPessoaFisica] deve chamar a fun????o de criar agente do sequelize', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    await service.criaPessoaFisica(dto, usuarioId);
    expect(agenteModelMock.create).toBeCalled();
  });

  // agente rede social
  it('[criaPessoaFisica] deve chamar a fun????o de criar em bulk redes sociais de agente do sequelize quando dados vierem no dto', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: {
        redesSociais: [
          {
            plataforma: PlataformaAgenteRedeSocialEnum.OUTROS,
            url: faker.internet.url(),
          },
        ],
      },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    expect(agenteRedeSocialModelMock.bulkCreate).toBeCalled();
  });

  // agente area atuacao

  it('[criaPessoaFisica] deve chamar dar erro NOT FOUND se dto conter pelo menos um id de ??reas de atua????o inexistente', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: [1, 2, -1] },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('??rea de atua????o n??o encontrada');
    }
  });

  it('[criaPessoaFisica] deve chamar dar erro UNPROCESSABLE ENTITY se dto conter pelo menos um id de ??reas de atua????o que requer areaAtuacaoOutros e o valor for vazio', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: {
        areasAtuacaoIds: [1, 2, areaAtuacaoComOutros],
        areaAtuacaoOutros: null,
      },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Campo "??rea de atua????o outros" ?? obrigat??rio');
    }
  });

  it('[criaPessoaFisica] deve chamar a fun????o de adicionar relations de areasAtuacao no agente se dto conter ids de ??reas de atua????o', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: [1, 2, 3] },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    const agenteModelMockCreateSpy = jest.spyOn(agenteModelMock, 'create');
    const agenteSpy = agenteModelMockCreateSpy.mock.results[0].value;
    expect(agenteSpy.$add).toBeCalled();
    expect(agenteSpy.$add.mock.calls[0][0]).toBe('areasAtuacao');
  });

  it('[criaPessoaFisica] deve chamar a fun????o de adicionar relations de areasAtuacao no agente se dto conter pelo menos um id de ??reas de atua????o que requer areaAtuacaoOutros e o valor existir', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: {
        areasAtuacaoIds: [1, 2, areaAtuacaoComOutros],
        areaAtuacaoOutros: faker.random.word(),
      },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    const agenteModelMockCreateSpy = jest.spyOn(agenteModelMock, 'create');
    const agenteSpy = agenteModelMockCreateSpy.mock.results[0].value;
    expect(agenteSpy.$add).toBeCalled();
    expect(agenteSpy.$add.mock.calls[0][0]).toBe('areasAtuacao');
  });

  // agente area estudo

  it('[criaPessoaFisica] deve chamar dar erro NOT FOUND se dto conter pelo menos um id de ??reas de estudo inexistente', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasEstudoIds: [1, 2, -1] },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('??rea de estudo n??o encontrada');
    }
  });

  it('[criaPessoaFisica] deve chamar a fun????o de adicionar relations de areasEstudo no agente se dto conter ids de ??reas de estudo', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasEstudoIds: [1, 2, 3] },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    const agenteModelMockCreateSpy = jest.spyOn(agenteModelMock, 'create');
    const agenteSpy = agenteModelMockCreateSpy.mock.results[0].value;
    expect(agenteSpy.$add).toBeCalled();
    expect(agenteSpy.$add.mock.calls[0][0]).toBe('areasEstudo');
  });

  // agente publico focal

  it('[criaPessoaFisica] deve chamar dar erro NOT FOUND se dto conter pelo menos um id de p??blicos focais inexistente', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { publicosFocaisIds: [1, 2, -1] },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('P??blico focal n??o encontrado');
    }
  });

  it('[criaPessoaFisica] deve chamar a fun????o de adicionar relations de publicosFocais no agente se dto conter ids de p??blicos focais', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { publicosFocaisIds: [1, 2, 3] },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    const agenteModelMockCreateSpy = jest.spyOn(agenteModelMock, 'create');
    const agenteSpy = agenteModelMockCreateSpy.mock.results[0].value;
    expect(agenteSpy.$add).toBeCalled();
    expect(agenteSpy.$add.mock.calls[0][0]).toBe('publicosFocais');
  });

  // agente tipo espaco

  it('[criaPessoaFisica] deve chamar dar erro NOT FOUND se dto conter pelo menos um id de tipos de espa??os inexistente', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { tiposEspacosIds: [1, 2, -1] },
    });
    try {
      await service.criaPessoaFisica(dto, usuarioId);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Tipo de espa??o n??o encontrado');
    }
  });

  it('[criaPessoaFisica] deve chamar a fun????o de adicionar relations de tiposEspacos no agente se dto conter ids de tipos de espa??os', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { tiposEspacosIds: [1, 2, 3] },
    });
    await service.criaPessoaFisica(dto, usuarioId);
    const agenteModelMockCreateSpy = jest.spyOn(agenteModelMock, 'create');
    const agenteSpy = agenteModelMockCreateSpy.mock.results[0].value;
    expect(agenteSpy.$add).toBeCalled();
    expect(agenteSpy.$add.mock.calls[0][0]).toBe('tiposEspacos');
  });

  // usuario

  it('[criaPessoaFisica] deve chamar a fun????o de atualizar usuario do sequelize', async () => {
    const usuarioId = 1;
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    await service.criaPessoaFisica(dto, usuarioId);
    const usuariofindByPkSpy = jest.spyOn(usuarioModelMock, 'findByPk');
    const usuarioSpy = usuariofindByPkSpy.mock.results[0].value;
    expect(usuarioSpy.update).toBeCalled();
  });

  /**
   * buscaEVerificaAreasAtuacao(areasAtuacaoIds)
   * fun????o para buscar e verificar ??reas de atua????o
   */
  it('[buscaEVerificaAreasAtuacao] deve retornar array de ??reas de atua????o para ids v??lidos', async () => {
    const areasAtuacaoIds = [1, 2, 3];
    const areaAtuacaoOutros = null;
    const areasAtuacao = await service.buscaEVerificaAreasAtuacao(
      areasAtuacaoIds,
      areaAtuacaoOutros,
    );
    expect(areaAtuacaoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(areasAtuacao)).toBe(true);
    expect(areasAtuacao.length).toEqual(areasAtuacaoIds.length);
    expect(areasAtuacao[0]).toHaveProperty('id');
    expect(areasAtuacao[0]).toHaveProperty('nome');
    expect(areasAtuacao[0]).toHaveProperty('outros');
  });

  it('[buscaEVerificaAreasAtuacao] deve dar erro NOT FOUND se pelo menos um dos ids n??o for encontrado', async () => {
    const areasAtuacaoIds = [1, 2, -1];
    const areaAtuacaoOutros = null;
    try {
      await service.buscaEVerificaAreasAtuacao(
        areasAtuacaoIds,
        areaAtuacaoOutros,
      );
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(areaAtuacaoModelMock.findAll).toHaveBeenCalled();
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('??rea de atua????o n??o encontrada');
    }
  });

  it('[buscaEVerificaAreasAtuacao] deve dar erro UNPROCESSABLE ENTITY se pelo menos uma das ??reas requerer outros e areaAtuacaoOutros for vazio', async () => {
    const areasAtuacaoIds = [1, 2, areaAtuacaoComOutros];
    const areaAtuacaoOutros = null;
    try {
      await service.buscaEVerificaAreasAtuacao(
        areasAtuacaoIds,
        areaAtuacaoOutros,
      );
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(areaAtuacaoModelMock.findAll).toHaveBeenCalled();
      expect(err).toBeInstanceOf(UnprocessableEntityException);
      expect(err.message).toBe('Campo "??rea de atua????o outros" ?? obrigat??rio');
    }
  });

  it('[buscaEVerificaAreasAtuacao] deve retornar array de ??reas de atua????o para ids v??lidos se pelo menos uma das ??reas requerer outros e areaAtuacaoOutros existir', async () => {
    const areasAtuacaoIds = [1, 2, areaAtuacaoComOutros];
    const areaAtuacaoOutros = faker.random.word();
    const areasAtuacao = await service.buscaEVerificaAreasAtuacao(
      areasAtuacaoIds,
      areaAtuacaoOutros,
    );
    expect(areaAtuacaoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(areasAtuacao)).toBe(true);
    expect(areasAtuacao.length).toEqual(areasAtuacaoIds.length);
    expect(areasAtuacao[0]).toHaveProperty('id');
    expect(areasAtuacao[0]).toHaveProperty('nome');
    expect(areasAtuacao[0]).toHaveProperty('outros');
  });

  /**
   * buscaEVerificaAreasEstudo(areasEstudoIds)
   * fun????o para buscar e verificar ??reas de estudo
   */
  it('[buscaEVerificaAreasEstudo] deve retornar array de ??reas de estudo para ids v??lidos', async () => {
    const areasEstudoIds = [1, 2, 3];
    const areasEstudo = await service.buscaEVerificaAreasEstudo(areasEstudoIds);
    expect(areaEstudoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(areasEstudo)).toBe(true);
    expect(areasEstudo.length).toEqual(areasEstudoIds.length);
    expect(areasEstudo[0]).toHaveProperty('id');
    expect(areasEstudo[0]).toHaveProperty('nome');
  });

  it('[buscaEVerificaAreasEstudo] deve dar erro NOT FOUND se pelo menos um dos ids n??o for encontrado', async () => {
    const areasEstudoIds = [1, 2, -1];
    try {
      await service.buscaEVerificaAreasEstudo(areasEstudoIds);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(areaEstudoModelMock.findAll).toHaveBeenCalled();
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('??rea de estudo n??o encontrada');
    }
  });

  /**
   * buscaEVerificaPublicosFocais(areasAtuacaoIds)
   * fun????o para buscar e verificar p??blicos focais
   */
  it('[buscaEVerificaPublicosFocais] deve retornar array de p??blicos focais para ids v??lidos', async () => {
    const publicosFocaisIds = [1, 2, 3];
    const publicosFocais = await service.buscaEVerificaPublicosFocais(
      publicosFocaisIds,
    );
    expect(publicoFocalModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(publicosFocais)).toBe(true);
    expect(publicosFocais.length).toEqual(publicosFocaisIds.length);
    expect(publicosFocais[0]).toHaveProperty('id');
    expect(publicosFocais[0]).toHaveProperty('nome');
    expect(publicosFocais[0]).toHaveProperty('outros');
  });

  it('[buscaEVerificaPublicosFocais] deve dar erro NOT FOUND se pelo menos um dos ids n??o for encontrado', async () => {
    const publicosFocaisIds = [1, 2, -1];
    try {
      await service.buscaEVerificaPublicosFocais(publicosFocaisIds);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(publicoFocalModelMock.findAll).toHaveBeenCalled();
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('P??blico focal n??o encontrado');
    }
  });

  /**
   * buscaEVerificaTiposEspacos(areasAtuacaoIds)
   * fun????o para buscar e verificar tipos de espa??os
   */
  it('[buscaEVerificaTiposEspacos] deve retornar array de p??blicos focais para ids v??lidos', async () => {
    const tiposEspacosIds = [1, 2, 3];
    const tiposEspacos = await service.buscaEVerificaTiposEspacos(
      tiposEspacosIds,
    );
    expect(tipoEspacoModelMock.findAll).toHaveBeenCalled();
    expect(Array.isArray(tiposEspacos)).toBe(true);
    expect(tiposEspacos.length).toEqual(tiposEspacosIds.length);
    expect(tiposEspacos[0]).toHaveProperty('id');
    expect(tiposEspacos[0]).toHaveProperty('nome');
    expect(tiposEspacos[0]).toHaveProperty('outros');
  });

  it('[buscaEVerificaTiposEspacos] deve dar erro NOT FOUND se pelo menos um dos ids n??o for encontrado', async () => {
    const tiposEspacosIds = [1, 2, -1];
    try {
      await service.buscaEVerificaTiposEspacos(tiposEspacosIds);
      throw new Error('N??o deveria chegar aqui');
    } catch (err) {
      expect(tipoEspacoModelMock.findAll).toHaveBeenCalled();
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('Tipo de espa??o n??o encontrado');
    }
  });
});
