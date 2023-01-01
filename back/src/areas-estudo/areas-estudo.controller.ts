import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AreaEstudo } from '@/models';
import { AreasEstudoService } from './areas-estudo.service';

@ApiTags('Área de Estudo')
@Controller('areas_estudo')
export class AreasEstudoController {
  constructor(private readonly areasEstudoService: AreasEstudoService) {}

  /**
   * Rota para listar as áreas de estudo
   * @returns {AreaEstudo[]} Lista de áreas de estudo
   */
  @ApiOkResponse({
    description: 'Lista de áreas de estudo',
    type: [AreaEstudo],
  })
  @Get()
  lista() {
    return this.areasEstudoService.lista();
  }
}
