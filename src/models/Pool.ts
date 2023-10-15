import { Cryptocurrency } from "@/models";
import { InferAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

@Table({ tableName: 'pool' })
export default class Wallet extends Model<InferAttributes<Wallet>, { host: string, port: number, cryptocurrencyId: number }> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id!: string

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    validate: {
      isUrl: {
        msg: 'host must be url'
      }
    }
  })
  host!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      minMax(value: number) {
        if (value < 0 || value > 65536) {
          throw new Error('port must be in range [0, 65536]')
        }
      }
    }
  })
  port!: number

  @ForeignKey(() => Cryptocurrency)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  cryptocurrencyId!: number

  @BelongsTo(() => Cryptocurrency)
  cryptocurrency!: Cryptocurrency
}
