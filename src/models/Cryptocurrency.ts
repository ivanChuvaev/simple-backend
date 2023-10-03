import { Algorithm } from "@models";
import { InferAttributes } from "sequelize";
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

type CreationProps = {
  name: string
  fullName?: string
  algorithmId: number
}

@Table({ tableName: 'cryptocurrency' })
export default class Cryptocurrency extends Model<InferAttributes<Cryptocurrency>, CreationProps> {
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

  @Column({
    type: DataType.STRING(60),
    allowNull: true,
    validate: {
      len: {
        args: [3, 60],
        msg: 'full name length must be between 3 and 60'
      },
    }
  })
  fullName!: string

  @ForeignKey(() => Algorithm)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    references: {
      model: Algorithm
    }
  })
  algorithmId!: number

  @BelongsTo(() => Algorithm)
  algorithm!: Algorithm
}
