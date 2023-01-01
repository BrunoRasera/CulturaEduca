import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { CriaUsuarioDto } from '@/usuarios/dto';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { UsuariosService } from '@/usuarios/usuarios.service';
import { usuarioBulkCreate, usuarioCreate } from './utils/usuarios.factory';
import { Usuario } from '@/models';

describe('UsuariosController (e2e)', () => {
  let app: INestApplication;
  let usuarioModel: typeof Usuario;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    usuarioModel = moduleFixture.get(UsuariosService).usuarioModel;

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3001);
    pactum.request.setBaseUrl('http://localhost:3001');
    // factory de usuarios
    usuarioBulkCreate(usuarioModel, 100);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/usuarios (GET)', async () => {
    return pactum.spec().get('/usuarios').expectStatus(HttpStatus.OK);
  });

  it('/usuarios (POST)', async () => {
    const dto: CriaUsuarioDto = {
      nome: faker.name.firstName(),
      sobrenome: faker.name.lastName(),
    };
    return pactum
      .spec()
      .post('/usuarios')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED)
      .expectJsonLike({
        nome: dto.nome.trim(),
        sobrenome: dto.sobrenome.trim(),
      });
  });

  it.todo(
    '/usuarios (POST) - Deve retornar erro com dto incompleto ou incorreto',
  );

  it.todo(
    '/usuarios/:usuarioId (PATCH) - Deve retornar erro com dto incompleto ou incorreto',
  );

  it.todo('/usuarios/:usuarioId (PATCH) - Deve atualizar usuário');

  it('/usuarios/:usuarioId (DELETE) - Deve retornar Status OK e remover usuário do banco', async () => {
    const usuario = await usuarioCreate(usuarioModel);
    await pactum
      .spec()
      .delete(`/usuarios/${usuario.id}`)
      .expectStatus(HttpStatus.OK)
      .expectJsonLike({
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        createdAt: usuario.createdAt.toISOString(),
        updatedAt: usuario.updatedAt.toISOString(),
      });
    const usuarioRemovido = await usuarioModel.findByPk(usuario.id);
    expect(usuarioRemovido).toBeFalsy();
  });

  it('/usuarios/:usuarioId (DELETE) - Deve retornar Status NOT FOUND para usuário que não existe', async () => {
    const usuarioId = 0;
    return pactum
      .spec()
      .delete(`/usuarios/${usuarioId}`)
      .expectStatus(HttpStatus.NOT_FOUND)
      .expectJsonLike({
        message: 'Usuário não encontrado',
      });
  });
});
