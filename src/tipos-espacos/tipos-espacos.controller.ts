import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { TipoEspaco } from '@/models';
import { TiposEspacosService } from './tipos-espacos.service';

@ApiTags('Tipo de Espaço')
@Controller('tipos_espacos')
export class TiposEspacosController {
  constructor(private readonly tiposEspacosService: TiposEspacosService) {}

  /**
   * Rota para listar os tipos de espaço
   * @returns {TiposEspaco[]} Lista de tipos de espaço
   */
  @ApiOkResponse({
    description: 'Lista de tipos de espaço',
    type: [TipoEspaco],
  })
  @Get()
  lista() {
    return this.tiposEspacosService.lista();
  }
}
