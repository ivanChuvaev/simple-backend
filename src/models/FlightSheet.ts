import { Cryptocurrency, Miner, Wallet } from "@models";
import { InferAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Pool } from "@models";

type CreationProps = {
  name: string
  walletId: number
  poolId: number
  cryptocurrencyId: number
  minerId: number
}

@Table({ tableName: 'flight_sheet' })
export default class FlightSheet extends Model<InferAttributes<FlightSheet>, CreationProps> {
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    validate: {
      len: {
        args: [3, 30],
        msg: 'name length must be between 3 and 30'
      },
      is: {
        args: /^[\w\d_]*$/i,
        msg: 'name should consists of latin characters, digits and underscore'
      }
    }
  })
  name!: string

  @ForeignKey(() => Wallet)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  walletId!: number

  @ForeignKey(() => Pool)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  poolId!: number

  @ForeignKey(() => Cryptocurrency)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  cryptocurrencyId!: number

  @ForeignKey(() => Miner)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  minerId!: number

  @BelongsTo(() => Wallet)
  wallet!: Wallet

  @BelongsTo(() => Pool)
  pool!: Pool

  @BelongsTo(() => Cryptocurrency)
  cryptocurrency!: Cryptocurrency

  @BelongsTo(() => Miner)
  miner!: Miner
}
