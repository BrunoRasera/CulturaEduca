import { PartialType } from '@nestjs/swagger';
import { CriaUsuarioDto } from './cria-usuario.dto';

export class AtualizaUsuarioDto extends PartialType(CriaUsuarioDto) {}
