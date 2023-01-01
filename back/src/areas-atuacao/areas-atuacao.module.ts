import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { AreaAtuacao } from '@/models';
import { AreasAtuacaoService } from './areas-atuacao.service';
import { AreasAtuacaoController } from './areas-atuacao.controller';

@Module({
  imports: [SequelizeModule.forFeature([AreaAtuacao])],
  providers: [AreasAtuacaoService],
  controllers: [AreasAtuacaoController],
})
export class AreasAtuacaoModule {}
