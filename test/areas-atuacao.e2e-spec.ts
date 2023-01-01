import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { expression } from 'pactum-matchers';
import { Op } from 'sequelize';

import { AreaAtuacao } from '@/models';
import { AreasAtuacaoService } from '@/areas-atuacao/areas-atuacao.service';
import { AppModule } from '../src/app.module';
import { areaAtuacaoBulkCreate } from './utils/areas-atuacao.factory';

describe('AreasAtuacaoController (e2e)', () => {
  let app: INestApplication;
  let areaAtuacaoModel: typeof AreaAtuacao;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    areaAtuacaoModel = moduleFixture.get(AreasAtuacaoService).areaAtuacaoModel;

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3001);
    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterEach(async () => {
    await areaAtuacaoModel.destroy({ where: { id: { [Op.gt]: 0 } } });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/areas_atuacao (GET)', async () => {
    areaAtuacaoBulkCreate(areaAtuacaoModel, 100);
    return pactum
      .spec()
      .get('/areas_atuacao')
      .expectStatus(HttpStatus.OK)
      .expectJsonMatch(expression('$V.length >= 100'))
      .expectJsonSchema({
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            outros: { type: 'boolean' },
          },
        },
      });
  });
});
