import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { AreaEstudo } from '@/models';

@Injectable()
export class AreasEstudoService {
  constructor(
    @InjectModel(AreaEstudo) public areaEstudoModel: typeof AreaEstudo,
  ) {}

  /**
   * Busca todas as áreas de estudo no banco
   * @returns {Promise<AreaEstudo[]>} Array de áreas de estudo
   */
  lista() {
    return this.areaEstudoModel.findAll();
  }
}
