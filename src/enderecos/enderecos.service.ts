import { Endereco } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class EnderecosService {
  constructor(@InjectModel(Endereco) public enderecoModel: typeof Endereco) {}

  /**
   * Cria um endereço
   * @param dto Dto com dados para criação do endereco
   * @returns O endereço criado
   */
  async cria(dto: any) {
    // cria endereco a partir do dto
    // verifica se long e lat que vieram são válidas
    // geom = { type: 'Point', coordinates: [-76.984722, 39.807222]}; GeoJson format: [lng, lat]
  }

  // service de atualizar

  // service de remover
}
