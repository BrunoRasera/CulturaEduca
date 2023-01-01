import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import {
  IdentidadeGeneroUsuarioEnum,
  RacaCorIbgeUsuarioEnum,
} from '@/usuarios/usuarios.constants';
import { Agente } from './agente.model';
import { Endereco } from './endereco.model';
import { Escolaridade } from './escolaridade.model';
import { Etnia } from './etnia.model';
import { Ocupacao } from './ocupacao.model';

@Table({ tableName: 'usuario', underscored: true })
export class Usuario extends Model<Usuario> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.UUID)
  stId: string;

  @AllowNull(true)
  @ForeignKey(() => Agente)
  @Column(DataType.INTEGER)
  agenteId: number | null;

  @AllowNull(true)
  @ForeignKey(() => Endereco)
  @Column(DataType.INTEGER)
  enderecoId: number | null;

  @AllowNull(true)
  @ForeignKey(() => Etnia)
  @Column(DataType.INTEGER)
  etniaId: number | null;

  @AllowNull(true)
  @ForeignKey(() => Ocupacao)
  @Column(DataType.INTEGER)
  ocupacaoId: number | null;

  @AllowNull(true)
  @ForeignKey(() => Escolaridade)
  @Column(DataType.INTEGER)
  escolaridadeId: number | null;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  nome: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  sobrenome: string;

  @AllowNull(true)
  @Column(DataType.ENUM({ values: Object.values(IdentidadeGeneroUsuarioEnum) }))
  identidadeGenero: IdentidadeGeneroUsuarioEnum | null;

  @AllowNull(true)
  @Column(DataType.ENUM({ values: Object.values(RacaCorIbgeUsuarioEnum) }))
  racaCorIbge: RacaCorIbgeUsuarioEnum | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  etniaOutros: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  ocupacaoOutros: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;

  // relations

  @BelongsTo(() => Agente, 'agenteId')
  agente?: Agente;

  @BelongsTo(() => Endereco, 'enderecoId')
  endereco?: Endereco;

  @BelongsTo(() => Etnia, 'etniaId')
  etnia?: Etnia;

  @BelongsTo(() => Ocupacao, 'ocupacaoId')
  ocupacao?: Ocupacao;

  @BelongsTo(() => Escolaridade, 'escolaridadeId')
  escolaridade?: Escolaridade;
}
