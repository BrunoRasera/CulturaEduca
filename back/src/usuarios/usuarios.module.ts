import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Escolaridade, Etnia, Ocupacao, Usuario } from '@/models';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Escolaridade, Etnia, Ocupacao, Usuario]),
  ],
  providers: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
