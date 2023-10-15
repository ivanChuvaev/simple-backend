import { Cryptocurrency } from "@/models";
import { InferAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

type CreationProps = {
  name: string
  source: string
  address: string
  cryptocurrencyId: number
}

@Table({ tableName: 'wallet' })
export default class Wallet extends Model<InferAttributes<Wallet>, CreationProps> {
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
      is: {
        args: /^[\w\d_]*$/i,
        msg: 'name should consists of latin characters, digits and underscore'
      }
    }
  })
  name!: string

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    validate: {
      is: {
        args: /^[\w\d_]*$/i,
        msg: 'source should consists of latin characters, digits and underscore'
      }
    }
  })
  source!: string

  @Column({
    type: DataType.STRING(256),
    allowNull: false,
    validate: {
      is: {
        args: /^[\w\d]*$/i,
        msg: 'address must consist of latin characters and digits'
      }
    }
  })
  address!: string

  @ForeignKey(() => Cryptocurrency)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  cryptocurrencyId!: number

  @BelongsTo(() => Cryptocurrency)
  cryptocurrency!: Cryptocurrency
}
