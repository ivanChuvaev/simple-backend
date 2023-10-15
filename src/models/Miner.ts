import { Algorithm, AlgorithmMiner } from "@/models";
import { InferAttributes } from "sequelize";
import { AllowNull, BelongsToMany, Column, DataType, Model, Table, Validate } from "sequelize-typescript";

type CreationProps = {
  name: string
}

@Table({ tableName: 'miner' })
export default class Miner extends Model<InferAttributes<Miner>, CreationProps> {
  @Column({
    type: DataType.SMALLINT,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  })
  id!: number

  @AllowNull(false)
  @Validate({
    len: {
      args: [3, 30],
      msg: 'name length must be between 3 and 30'
    },
    is: {
      args: /^[\w\d_]*$/i,
      msg: 'name should consists of latin characters, digits and underscores'
    }
  })
  @Column(DataType.STRING(30))
  name!: string

  @Column({
    type: DataType.STRING(60),
    allowNull: true,
    validate: {
      len: {
        args: [3, 60],
        msg: 'full name length must be between 3 and 30'
      },
      is: {
        args: /^[\w\d_]*$/i,
        msg: 'name should consists of latin characters, digits and underscores'
      }
    }
  })
  fullName!: string

  @BelongsToMany(() => Algorithm, () => AlgorithmMiner)
  algorithms!: Algorithm[]
}
