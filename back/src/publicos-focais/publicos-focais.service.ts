import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { PublicoFocal } from '@/models';

@Injectable()
export class PublicosFocaisService {
  constructor(
    @InjectModel(PublicoFocal) public publicoFocalModel: typeof PublicoFocal,
  ) {}

  /**
   * Busca todas os públicos focais no banco
   * @returns {Promise<PublicoFocal[]>} Array de públicos focais
   */
  lista() {
    return this.publicoFocalModel.findAll();
  }
}
