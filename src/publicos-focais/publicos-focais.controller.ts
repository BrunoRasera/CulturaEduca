import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PublicoFocal } from '@/models';
import { PublicosFocaisService } from './publicos-focais.service';

@ApiTags('Público Focal')
@Controller('publicos_focais')
export class PublicosFocaisController {
  constructor(private readonly publicosFocaisService: PublicosFocaisService) {}

  /**
   * Rota para listar os públicos focais
   * @returns {PublicoFocal[]} Lista de públicos focais
   */
  @ApiOkResponse({
    description: 'Lista de públicos focais',
    type: [PublicoFocal],
  })
  @Get()
  lista() {
    return this.publicosFocaisService.lista();
  }
}
