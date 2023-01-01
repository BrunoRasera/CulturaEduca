import { Usuario } from '@/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AtualizaUsuarioDto, CriaUsuarioDto } from './dto';
import { UsuariosService } from './usuarios.service';

@ApiTags('Usuário')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Rota para buscar usuário por id
   * @param usuarioId Id do usuário
   * @returns Usuário encontrado
   */
  @ApiOkResponse({
    description: 'Usuário encontrado',
    type: Usuario,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
  })
  @Get(':usuarioId')
  async busca(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.usuariosService.busca(usuarioId);
  }

  /**
   * Rota para listar usuários
   * @returns Lista de usuários
   */
  @ApiOkResponse({
    description: 'Lista de usuários',
    type: [Usuario],
  })
  @Get()
  async lista() {
    return this.usuariosService.lista();
  }

  /**
   * Rota para criar usuário
   * @param dto Dto contendo dados para criar usuário
   * @returns Usuário criado
   */
  @ApiCreatedResponse({
    description: 'Usuário criado',
    type: Usuario,
  })
  @Post()
  async cria(@Body() dto: CriaUsuarioDto) {
    return this.usuariosService.cria(dto);
  }

  /**
   * Rota para atualizar usuário
   * @param usuarioId Id do usuário
   * @param dto Dto contendo dados para atualizar usuário
   * @returns Usuário atualizado
   */
  @ApiOkResponse({
    description: 'Usuário atualizado',
    type: Usuario,
  })
  @Patch(':usuarioId')
  async atualiza(
    @Param('usuarioId', ParseIntPipe) usuarioId: number,
    @Body() dto: AtualizaUsuarioDto,
  ) {
    return this.usuariosService.atualiza(usuarioId, dto);
  }

  /**
   * Rota para remover usuário
   * @param usuarioId Id do usuário
   * @returns Usuário removido
   */
  @ApiOkResponse({
    description: 'Usuário removido',
    type: Usuario,
  })
  @Delete(':usuarioId')
  async remove(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.usuariosService.remove(usuarioId);
  }
}
