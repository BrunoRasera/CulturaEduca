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

import { PlataformaAgenteRedeSocialEnum } from '@/agentes/agentes.constants';
import { Agente } from './agente.model';

@Table({
  tableName: 'agente_rede_social',
  underscored: true,
  timestamps: false,
})
export class AgenteRedeSocial extends Model<AgenteRedeSocial> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @ForeignKey(() => Agente)
  @Column(DataType.INTEGER)
  agenteId: number;

  @AllowNull(false)
  @Column(
    DataType.ENUM({ values: Object.values(PlataformaAgenteRedeSocialEnum) }),
  )
  plataforma: PlataformaAgenteRedeSocialEnum;

  @AllowNull(false)
  @Column(DataType.STRING)
  url: string;

  // relations
  @BelongsTo(() => Agente, 'agenteId')
  agente?: Agente;
}
