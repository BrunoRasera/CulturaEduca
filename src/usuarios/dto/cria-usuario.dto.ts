import { IsString } from 'class-validator';

export class CriaUsuarioDto {
  @IsString()
  nome: string;

  @IsString()
  sobrenome: string;
}
