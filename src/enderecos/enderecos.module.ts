import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Endereco } from '@/models';
import { EnderecosService } from './enderecos.service';

@Module({
  imports: [SequelizeModule.forFeature([Endereco])],
  providers: [EnderecosService],
})
export class EnderecosModule {}
