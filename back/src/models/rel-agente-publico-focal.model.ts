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
import { PublicoFocal } from './publico-focal.model';

@Table({
  tableName: 'rel_agente_publico_focal',
  underscored: true,
  timestamps: false,
})
export class RelAgentePublicoFocal extends Model<RelAgentePublicoFocal> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Agente)
  @Column(DataType.INTEGER)
  agenteId: number;

  @AllowNull(false)
  @ForeignKey(() => PublicoFocal)
  @Column(DataType.INTEGER)
  publicoFocalId: number;

  // relations
  @BelongsTo(() => Agente, 'agenteId')
  agente?: Agente;

  @BelongsTo(() => PublicoFocal, 'publicoFocalId')
  publicoFocal?: PublicoFocal;
}
