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

@Table({ tableName: 'ocupacao', underscored: true, timestamps: false })
export class Ocupacao extends Model<Ocupacao> {
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
