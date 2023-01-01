import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { TipoEspaco } from '@/models';
import { TiposEspacosService } from './tipos-espacos.service';
import { TiposEspacosController } from './tipos-espacos.controller';

@Module({
  imports: [SequelizeModule.forFeature([TipoEspaco])],
  providers: [TiposEspacosService],
  controllers: [TiposEspacosController],
})
export class TiposEspacosModule {}
