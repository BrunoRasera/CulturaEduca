import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  IsEmail,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { AbrangenciaGeograficaAgenteEnum } from '@/agentes/agentes.constants';
import { AreaAtuacao } from './area-atuacao.model';
import { Endereco } from './endereco.model';
import { RelAgenteAreaAtuacao } from './rel-agente-area-atuacao.model';
import { Usuario } from './usuario.model';
import { AreaEstudo } from './area-estudo.model';
import { RelAgenteAreaEstudo } from './rel-agente-area-estudo.model';
import { PublicoFocal } from './publico-focal.model';
import { RelAgentePublicoFocal } from './rel-agente-publico-focal.model';
import { TipoEspaco } from './tipo-espaco.model';
import { RelAgenteTipoEspaco } from './rel-agente-tipo-espaco.model';
import { AgenteRedeSocial } from './agente-rede-social.model';

@Table({ tableName: 'agente', underscored: true })
export class Agente extends Model<Agente> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(true)
  @ForeignKey(() => Endereco)
  @Column(DataType.INTEGER)
  enderecoId: number | null;

  @AllowNull(false)
  @NotEmpty
  @IsEmail
  @Column(DataType.STRING)
  email: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  telefone1: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  telefone2: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  site: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  atuaDesdeAno: number | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  areaAtuacaoOutros: string | null;

  @AllowNull(true)
  @Column(
    DataType.ENUM({ values: Object.values(AbrangenciaGeograficaAgenteEnum) }),
  )
  abrangenciaGeografica: AbrangenciaGeograficaAgenteEnum | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  historico: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  objetivo: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @AllowNull(true)
  @ForeignKey(() => Usuario)
  @Column(DataType.INTEGER)
  createdBy: number | null;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  @AllowNull(true)
  @ForeignKey(() => Usuario)
  @Column(DataType.INTEGER)
  updatedBy: number | null;

  // relations

  @BelongsTo(() => Endereco, 'enderecoId')
  endereco?: Endereco;

  @BelongsTo(() => Usuario, 'createdBy')
  usuarioCreatedBy?: Usuario;

  @BelongsTo(() => Usuario, 'updatedBy')
  usuarioUpdatedBy?: Usuario;

  @HasMany(() => AgenteRedeSocial, 'agenteId')
  redesSociais?: AgenteRedeSocial;

  @BelongsToMany(() => AreaAtuacao, () => RelAgenteAreaAtuacao)
  areasAtuacao?: AreaAtuacao[];

  @BelongsToMany(() => AreaEstudo, () => RelAgenteAreaEstudo)
  areasEstudo?: AreaEstudo[];

  @BelongsToMany(() => PublicoFocal, () => RelAgentePublicoFocal)
  publicosFocais?: PublicoFocal[];

  @BelongsToMany(() => TipoEspaco, () => RelAgenteTipoEspaco)
  tiposEspacos?: TipoEspaco[];
}
