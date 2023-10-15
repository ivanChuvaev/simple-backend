import { InferAttributes } from "sequelize"
import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { Algorithm, Miner } from "@/models"

type CreationProps = {
  algorithmId: string
  minerId: string
}

@Table({ tableName: 'algorithm_miner_mtm' })
export default class AlgorithmMiner extends Model<InferAttributes<AlgorithmMiner>, CreationProps> {
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number
  
  @ForeignKey(() => Algorithm)
  @Column(DataType.UUID)
  algorithmId!: string

  @ForeignKey(() => Miner)
  @Column(DataType.UUID)
  minerId!: string
}
