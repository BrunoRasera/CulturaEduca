import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { Usuario } from '@/models';
import { AtualizaUsuarioDto, CriaUsuarioDto } from './dto';

@Injectable()
export class UsuariosService {
  constructor(@InjectModel(Usuario) public usuarioModel: typeof Usuario) {}

  /**
   * Busca usuário por id
   * @param usuarioId Id do usuário
   * @throws NotFoundException se usuário não for encontrado
   * @returns Usuário encontrado
   */
  async busca(usuarioId: number) {
    const usuario = await this.usuarioModel.findByPk(usuarioId);
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return usuario;
  }

  /**
   * Lista todos os usuários
   * @returns Lista de usuários encontrados
   */
  async lista() {
    return this.usuarioModel.findAll();
  }

  /**
   * Cria um usuário
   * @returns O usuário criado
   */
  async cria(dto: CriaUsuarioDto) {
    const dataUsuario = {
      stId: uuidv4(),
      nome: dto.nome?.trim(),
      sobrenome: dto.sobrenome?.trim(),
    } as Usuario;
    const usuario = await this.usuarioModel.create(dataUsuario);
    return usuario;
  }

  /**
   * Atualiza um usuário
   * @param usuarioId Id do usuário
   * @returns O usuário atualizado
   */
  async atualiza(usuarioId: number, dto: AtualizaUsuarioDto) {
    const usuario = await this.busca(usuarioId);
    const dataUsuario = {
      ...(dto.hasOwnProperty('nome') ? { nome: dto.nome?.trim() } : {}),
      ...(dto.hasOwnProperty('sobrenome')
        ? { sobrenome: dto.sobrenome?.trim() }
        : {}),
    } as Usuario;
    await usuario.update(dataUsuario);
    return usuario;
  }

  /**
   * Remove um usuário
   * @param usuarioId Id do usuário
   * @returns O usuário removido
   */
  async remove(usuarioId: number) {
    const usuario = await this.busca(usuarioId);
    await usuario.destroy();
    return usuario;
  }
}
