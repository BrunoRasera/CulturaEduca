import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AreaAtuacao } from '@/models';
import { AreasAtuacaoService } from './areas-atuacao.service';

@ApiTags('Área de Atuação')
@Controller('areas_atuacao')
export class AreasAtuacaoController {
  constructor(private readonly areasAtuacaoService: AreasAtuacaoService) {}

  /**
   * Rota para listar as áreas de atuação
   * @returns {AreaAtuacao[]} Lista de áreas de atuação
   */
  @ApiOkResponse({
    description: 'Lista de áreas de atuação',
    type: [AreaAtuacao],
  })
  @Get()
  lista() {
    return this.areasAtuacaoService.lista();
  }
}
