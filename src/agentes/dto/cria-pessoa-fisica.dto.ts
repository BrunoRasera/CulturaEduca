import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  AbrangenciaGeograficaAgenteEnum,
  PlataformaAgenteRedeSocialEnum,
} from '../agentes.constants';
import {
  IdentidadeGeneroUsuarioEnum,
  RacaCorIbgeUsuarioEnum,
} from '@/usuarios/usuarios.constants';

class CriaPessoaFisicaDtoAgenteRedeSocial {
  @IsEnum(PlataformaAgenteRedeSocialEnum)
  plataforma: PlataformaAgenteRedeSocialEnum;

  @IsUrl()
  url: string;
}

class CriaPessoaFisicaDtoAgente {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefone1: string | null;

  @IsOptional()
  @IsString()
  telefone2: string | null;

  @IsOptional()
  @IsString()
  site: string | null;

  @IsOptional()
  @IsInt()
  atuaDesdeAno: number | null;

  @IsOptional()
  @IsString()
  areaAtuacaoOutros: string | null;

  @IsOptional()
  @IsEnum(AbrangenciaGeograficaAgenteEnum)
  abrangenciaGeografica: AbrangenciaGeograficaAgenteEnum | null;

  @IsOptional()
  @IsString()
  historico: string | null;

  @IsOptional()
  @IsString()
  objetivo: string | null;

  @IsOptional()
  @Type(() => CriaPessoaFisicaDtoAgenteRedeSocial)
  @ValidateNested({ each: true })
  redesSociais: CriaPessoaFisicaDtoAgenteRedeSocial[] | null;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  areasAtuacaoIds: number[] | null;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  areasEstudoIds: number[] | null;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  publicosFocaisIds: number[] | null;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tiposEspacosIds: number[] | null;
}

class CriaPessoaFisicaDtoUsuario {
  @IsOptional()
  @IsInt()
  etniaId: number | null;

  @IsOptional()
  @IsString()
  etniaOutros: string | null;

  @IsOptional()
  @IsInt()
  ocupacaoId: number | null;

  @IsOptional()
  @IsString()
  ocupacaoOutros: string | null;

  @IsOptional()
  @IsInt()
  escolaridadeId: number | null;

  @IsOptional()
  @IsEnum(IdentidadeGeneroUsuarioEnum)
  identidadeGenero: IdentidadeGeneroUsuarioEnum | null;

  @IsOptional()
  @IsEnum(RacaCorIbgeUsuarioEnum)
  racaCorIbge: RacaCorIbgeUsuarioEnum | null;
}

export class CriaPessoaFisicaDto {
  @Type(() => CriaPessoaFisicaDtoAgente)
  @ValidateNested()
  agente: CriaPessoaFisicaDtoAgente;

  @Type(() => CriaPessoaFisicaDtoUsuario)
  @ValidateNested()
  usuario: CriaPessoaFisicaDtoUsuario;
}
