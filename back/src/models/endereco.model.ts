import { Point } from 'geojson';
import {
  AllowNull,
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  NotEmpty,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'endereco', underscored: true })
export class Endereco extends Model<Endereco> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  logradouro: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  numero: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  complemento: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  bairro: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  codigoPostal: string | null;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
  municipioNome: string;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  municipioIbge: number | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  ufNome: string | null;

  @AllowNull(true)
  @Column(DataType.STRING)
  ufSigla: string | null;

  @AllowNull(false)
  @NotEmpty
  @Default('Brasil')
  @Column(DataType.STRING)
  paisNome: string;

  @AllowNull(false)
  @NotEmpty
  @Default('BRA')
  @Column(DataType.STRING)
  paisIso3: string;

  @AllowNull(true)
  @Column({
    type: DataType.GEOMETRY('POINT', 4326),
    set(value: any) {
      const lng = value?.coordinates[0];
      if (lng < -180 || lng > 180) throw new Error('Longitude inválida');
      const lat = value?.coordinates[1];
      if (lat < -90 || lng > 90) throw new Error('Latitude inválida');
      return value;
    },
  })
  geom: Point | null;

  @CreatedAt
  @Column(DataType.DATE)
  createdAt: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt: Date;
}
