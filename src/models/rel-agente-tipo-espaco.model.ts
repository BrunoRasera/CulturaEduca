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
import { TipoEspaco } from './tipo-espaco.model';

@Table({
  tableName: 'rel_agente_tipo_espaco',
  underscored: true,
  timestamps: false,
})
export class RelAgenteTipoEspaco extends Model<RelAgenteTipoEspaco> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Agente)
  @Column(DataType.INTEGER)
  agenteId: number;

  @AllowNull(false)
  @ForeignKey(() => TipoEspaco)
  @Column(DataType.INTEGER)
  tipoEspacoId: number;

  // relations
  @BelongsTo(() => Agente, 'agenteId')
  agente?: Agente;

  @BelongsTo(() => TipoEspaco, 'tipoEspacoId')
  tipoEspaco?: TipoEspaco;
}
