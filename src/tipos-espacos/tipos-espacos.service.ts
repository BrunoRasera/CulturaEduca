import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { TipoEspaco } from '@/models';

@Injectable()
export class TiposEspacosService {
  constructor(
    @InjectModel(TipoEspaco) public tipoEspacoModel: typeof TipoEspaco,
  ) {}

  /**
   * Busca todas os tipos de espaço no banco
   * @returns {Promise<TipoEspaco[]>} Array de tipos de espaço
   */
  lista() {
    return this.tipoEspacoModel.findAll();
  }
}
