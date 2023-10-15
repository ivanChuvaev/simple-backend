import { InferAttributes } from "sequelize";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { AlgorithmMiner, Cryptocurrency, Miner } from "@/models";

type CreationProps = {
  type: 'cpu' | 'gpu' | 'harddrive'
  name: string
}

@Table({ tableName: 'algorithm' })
export default class Algorithm extends Model<InferAttributes<Algorithm>, CreationProps> {
  @Column({
    type: DataType.SMALLINT,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number

  @Column({
    type: DataType.ENUM('cpu', 'gpu', 'harrdrive'),
    allowNull: false
  })
  type!: 'cpu' | 'gpu' | 'harddrive'

  @Column({
    type: DataType.STRING(30),
    validate: {
      len: {
        args: [3, 30],
        msg: 'name length must be between 3 and 30'
      },
      is: {
        args: /^[\w\d_]*$/i,
        msg: 'name should consists of latin characters, digits and underscores'
      }
    }
  })
  name!: string

  @HasMany(() => Cryptocurrency)
  cryptocurrencies!: Cryptocurrency[]

  @BelongsToMany(() => Miner, () => AlgorithmMiner)
  miners!: Miner[]
}
