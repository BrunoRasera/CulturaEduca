import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { AreaAtuacao } from '@/models';

@Injectable()
export class AreasAtuacaoService {
  constructor(
    @InjectModel(AreaAtuacao) public areaAtuacaoModel: typeof AreaAtuacao,
  ) {}

  /**
   * Busca todas as áreas de atuação no banco
   * @returns {Promise<AreaAtuacao[]>} Array de áreas de atuação
   */
  lista() {
    return this.areaAtuacaoModel.findAll();
  }
}
