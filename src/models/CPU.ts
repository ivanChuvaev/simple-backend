import { InferAttributes } from "sequelize"
import { Column, DataType, Model, Table } from "sequelize-typescript"

type CreationProps = {
  uuid: string
}

@Table({ tableName: 'cpu' })
export default class CPU extends Model<InferAttributes<CPU>, CreationProps> {
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  uuid!: string
}
