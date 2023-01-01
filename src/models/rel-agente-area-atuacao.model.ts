import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Agente } from './agente.model';
import { AreaAtuacao } from './area-atuacao.model';

@Table({
  tableName: 'rel_agente_area_atuacao',
  underscored: true,
  timestamps: false,
})
export class RelAgenteAreaAtuacao extends Model<RelAgenteAreaAtuacao> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Agente)
  @Column(DataType.INTEGER)
  agenteId: number;

  @AllowNull(false)
  @ForeignKey(() => AreaAtuacao)
  @Column(DataType.INTEGER)
  areaAtuacaoId: number;

  // relations
  @BelongsTo(() => Agente, 'agenteId')
  agente?: Agente;

  @BelongsTo(() => AreaAtuacao, 'areaAtuacaoId')
  areaAtuacao?: AreaAtuacao;
}
