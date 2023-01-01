import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AreaEstudo } from '@/models';
import { AreasEstudoService } from './areas-estudo.service';
import { AreasEstudoController } from './areas-estudo.controller';

@Module({
  imports: [SequelizeModule.forFeature([AreaEstudo])],
  providers: [AreasEstudoService],
  controllers: [AreasEstudoController],
})
export class AreasEstudoModule {}
