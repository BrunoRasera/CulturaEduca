import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  Agente,
  AgenteRedeSocial,
  AreaAtuacao,
  AreaEstudo,
  Escolaridade,
  Etnia,
  Ocupacao,
  PublicoFocal,
  RelAgenteAreaAtuacao,
  RelAgenteAreaEstudo,
  RelAgentePublicoFocal,
  RelAgenteTipoEspaco,
  TipoEspaco,
  Usuario,
} from '@/models';
import { AgentesService } from './agentes.service';
import { AgentesController } from './agentes.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AgenteRedeSocial,
      Agente,
      AreaAtuacao,
      AreaEstudo,
      Escolaridade,
      Etnia,
      Ocupacao,
      PublicoFocal,
      RelAgenteAreaAtuacao,
      RelAgenteAreaEstudo,
      RelAgentePublicoFocal,
      RelAgenteTipoEspaco,
      TipoEspaco,
      Usuario,
    ]),
  ],
  providers: [AgentesService],
  controllers: [AgentesController],
})
export class AgentesModule {}
