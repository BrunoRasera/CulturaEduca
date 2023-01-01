import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { Agente } from '@/models';
import { GetUser } from '@/get-user.decorator';
import { AgentesService } from './agentes.service';
import { CriaPessoaFisicaDto } from './dto';

@ApiTags('Agente')
@Controller('agentes')
export class AgentesController {
  constructor(private readonly agentesService: AgentesService) {}

  /**
   * Rota para criar agente pessoa física para o usuário
   * @param {CriaPessoaFisicaDto} dto Dto contendo dados para criar o agente
   * @param {number} usuarioId Id do usuário logado
   * @returns {Agente} Agente criado
   */
  @ApiCreatedResponse({
    description: 'Agente criado',
    type: Agente,
  })
  @Post('pessoa_fisica')
  criaPessoaFisica(
    @Body() dto: CriaPessoaFisicaDto,
    @GetUser('id') usuarioId: number,
  ) {
    return this.agentesService.criaPessoaFisica(dto, usuarioId);
  }
}
