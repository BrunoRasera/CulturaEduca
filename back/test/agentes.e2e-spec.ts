import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { AgentesService } from '@/agentes/agentes.service';
import {
  Agente,
  AreaAtuacao,
  AreaEstudo,
  Escolaridade,
  Etnia,
  Ocupacao,
} from '@/models';
import { CriaPessoaFisicaDto } from '@/agentes/dto/cria-pessoa-fisica.dto';
import { geraCriaPessoaFisicaDto } from './utils/agentes.factory';
import { Op } from 'sequelize';
import { etniaCreate } from './utils/etnias.factory';
import {
  areaAtuacaoBulkCreate,
  areaAtuacaoCreate,
} from './utils/areas-atuacao.factory';
import { ocupacaoCreate } from './utils/ocupacoes.factory';
import { escolaridadeCreate } from './utils/escolaridades.factory';
import {
  areaEstudoBulkCreate,
  areaEstudoCreate,
} from './utils/areas-estudo.factory';

describe('AgentesController (e2e)', () => {
  let app: INestApplication;
  let agenteModel: typeof Agente;
  let areaAtuacaoModel: typeof AreaAtuacao;
  let areaEstudoModel: typeof AreaEstudo;
  let escolaridadeModel: typeof Escolaridade;
  let etniaModel: typeof Etnia;
  let ocupacaoModel: typeof Ocupacao;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    agenteModel = moduleFixture.get(AgentesService).agenteModel;
    areaAtuacaoModel = moduleFixture.get(AgentesService).areaAtuacaoModel;
    areaEstudoModel = moduleFixture.get(AgentesService).areaEstudoModel;
    escolaridadeModel = moduleFixture.get(AgentesService).escolaridadeModel;
    etniaModel = moduleFixture.get(AgentesService).etniaModel;
    ocupacaoModel = moduleFixture.get(AgentesService).ocupacaoModel;

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3001);
    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterEach(async () => {
    await agenteModel.destroy({ where: { id: { [Op.gt]: 0 } } });
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * [POST] /agentes/pessoa_fisica
   * Cria agente pessoa física
   */

  // email

  it('/agentes/pessoa_fisica (POST) dto com apenas email deve retornar CREATED', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  it('/agentes/pessoa_fisica (POST) dto sem o email do agente deve retornar BAD REQUEST', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto();
    delete dto.agente.email;
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.BAD_REQUEST);
  });

  it('/agentes/pessoa_fisica (POST) dto com email do agente inválido deve retornar BAD REQUEST', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { email: 'foobar' },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.BAD_REQUEST);
  });

  // etnia

  it('/agentes/pessoa_fisica (POST) dto com etniaId do usuário que não existe deve retornar NOT FOUND', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId: -1 },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com etniaId existente deve retornar CREATED', async () => {
    const etnia = await etniaCreate(etniaModel);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId: etnia.id },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  it('/agentes/pessoa_fisica (POST) dto com etniaId existente mas indicada como "outros" deve retornar UNPROCESSABLE ENTITY se dto não conter etniaOutros', async () => {
    const etniaOutros = await etniaCreate(etniaModel, true);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId: etniaOutros.id },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('/agentes/pessoa_fisica (POST) dto com etniaId existente mas indicada como "outros" deve retornar CREATED se dto conter etniaOutros', async () => {
    const etniaOutros = await etniaCreate(etniaModel, true);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { etniaId: etniaOutros.id, etniaOutros: faker.random.word() },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  // ocupacao

  it('/agentes/pessoa_fisica (POST) dto com ocupacaoId do usuário que não existe deve retornar NOT FOUND', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { ocupacaoId: -1 },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com ocupacaoId existente deve retornar CREATED', async () => {
    const ocupacao = await ocupacaoCreate(ocupacaoModel);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { ocupacaoId: ocupacao.id },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  it('/agentes/pessoa_fisica (POST) dto com ocupacaoId existente mas indicada como "outros" deve retornar UNPROCESSABLE ENTITY se dto não conter ocupacaoOutros', async () => {
    const ocupacaoOutros = await ocupacaoCreate(ocupacaoModel, true);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { ocupacaoId: ocupacaoOutros.id },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('/agentes/pessoa_fisica (POST) dto com ocupacaoId existente mas indicada como "outros" deve retornar CREATED se dto conter ocupacaoOutros', async () => {
    const ocupacaoOutros = await ocupacaoCreate(ocupacaoModel, true);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: {
        ocupacaoId: ocupacaoOutros.id,
        ocupacaoOutros: faker.random.word(),
      },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  // escolaridade

  it('/agentes/pessoa_fisica (POST) dto com escolaridadeId do usuário que não existe deve retornar NOT FOUND', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { escolaridadeId: -1 },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com escolaridadeId existente deve retornar CREATED', async () => {
    const escolaridade = await escolaridadeCreate(escolaridadeModel);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      usuario: { escolaridadeId: escolaridade.id },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  // areas atuacao

  it('/agentes/pessoa_fisica (POST) dto com uma areaAtuacaoId inexistente deve retornar NOT FOUND', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: [-1] },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com pelo menos uma areaAtuacaoId inexistente deve retornar NOT FOUND', async () => {
    const areasAtuacao = await areaAtuacaoBulkCreate(areaAtuacaoModel, 10);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: areasAtuacao.map((el) => el.id).concat([-1]) },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com uma areaAtuacaoId existente deve retornar CREATED', async () => {
    const areaAtuacao = await areaAtuacaoCreate(areaAtuacaoModel);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: [areaAtuacao.id] },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  it('/agentes/pessoa_fisica (POST) dto com várias areasAtuacaoIds existentes deve retornar CREATED', async () => {
    const areasAtuacao = await areaAtuacaoBulkCreate(areaAtuacaoModel, 10);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: areasAtuacao.map((el) => el.id) },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  it('/agentes/pessoa_fisica (POST) dto com areasAtuacaoIds existentes mas pelo menos uma indicada com outros deve retornar UNPROCESSABLE ENTITY se dto não conter areaAtuacaoOutros', async () => {
    const areaAtuacaoOutros = await areaAtuacaoCreate(areaAtuacaoModel, true);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasAtuacaoIds: [areaAtuacaoOutros.id] },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.UNPROCESSABLE_ENTITY);
  });

  it('/agentes/pessoa_fisica (POST) dto com areasAtuacaoIds existentes mas pelo menos uma indicada com outros deve retornar CREATED se dto conter areaAtuacaoOutros', async () => {
    const areaAtuacaoOutros = await areaAtuacaoCreate(areaAtuacaoModel, true);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: {
        areasAtuacaoIds: [areaAtuacaoOutros.id],
        areaAtuacaoOutros: faker.random.word(),
      },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  // areas estudo

  it('/agentes/pessoa_fisica (POST) dto com uma areaEstudoId inexistente deve retornar NOT FOUND', async () => {
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasEstudoIds: [-1] },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com pelo menos uma areaEstudoId inexistente deve retornar NOT FOUND', async () => {
    const areasEstudo = await areaEstudoBulkCreate(areaEstudoModel, 10);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasEstudoIds: areasEstudo.map((el) => el.id).concat([-1]) },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.NOT_FOUND);
  });

  it('/agentes/pessoa_fisica (POST) dto com uma areaEstudoId existente deve retornar CREATED', async () => {
    const areaEstudo = await areaEstudoCreate(areaEstudoModel);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasEstudoIds: [areaEstudo.id] },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });

  it('/agentes/pessoa_fisica (POST) dto com várias areasEstudoIds existentes deve retornar CREATED', async () => {
    const areasEstudo = await areaEstudoBulkCreate(areaEstudoModel, 10);
    const dto: CriaPessoaFisicaDto = geraCriaPessoaFisicaDto({
      agente: { areasEstudoIds: areasEstudo.map((el) => el.id) },
    });
    return pactum
      .spec()
      .post('/agentes/pessoa_fisica')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  });
});
