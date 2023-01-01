import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'area_atuacao', underscored: true, timestamps: false })
export class AreaAtuacao extends Model<AreaAtuacao> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  nome: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  outros: boolean;
}
