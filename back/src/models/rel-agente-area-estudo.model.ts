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
import { AreaEstudo } from './area-estudo.model';

@Table({
  tableName: 'rel_agente_area_estudo',
  underscored: true,
  timestamps: false,
})
export class RelAgenteAreaEstudo extends Model<RelAgenteAreaEstudo> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Agente)
  @Column(DataType.INTEGER)
  agenteId: number;

  @AllowNull(false)
  @ForeignKey(() => AreaEstudo)
  @Column(DataType.INTEGER)
  areaEstudoId: number;

  // relations
  @BelongsTo(() => Agente, 'agenteId')
  agente?: Agente;

  @BelongsTo(() => AreaEstudo, 'areaEstudoId')
  areaEstudo?: AreaEstudo;
}
