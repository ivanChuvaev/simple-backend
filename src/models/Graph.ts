import { InferAttributes } from "sequelize"
import { BeforeSave, BeforeUpdate, BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { Cryptocurrency, GPU, Harddrive } from "@models"
import { CPU } from "@models"

type CreationProps = {
  hashrate: number
  power: number
  temp: number
  cryptocurrencyId: number
  gpuId?: number
  cpuId?: number
  harddriveId?: number
}

@Table({ tableName: 'graph' })
export default class Graph extends Model<InferAttributes<Graph>, CreationProps> {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number

  @Column(DataType.BIGINT)
  hashrate!: number

  @Column(DataType.SMALLINT)
  power!: number

  @Column(DataType.SMALLINT)
  temp!: number

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false
  })
  timestamp!: Date

  @ForeignKey(() => Cryptocurrency)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false
  })
  cryptocurrencyId!: number

  @ForeignKey(() => GPU)
  @Column({ type: DataType.SMALLINT, allowNull: true })
  gpuId!: number | null

  @ForeignKey(() => CPU)
  @Column({ type: DataType.SMALLINT, allowNull: true })
  cpuId!: number | null

  @ForeignKey(() => Harddrive)
  @Column({ type: DataType.SMALLINT, allowNull: true })
  harddriveId!: number | null

  @BelongsTo(() => Cryptocurrency)
  cryptocurrency!: Cryptocurrency

  @BelongsTo(() => GPU)
  gpu!: GPU

  @BelongsTo(() => CPU)
  cpu!: CPU

  @BelongsTo(() => Harddrive)
  harddrive!: Harddrive

  @BeforeSave
  @BeforeUpdate
  private static checkIdOfDeviceHook(instance: Graph) {
    const sum = (instance.gpuId !== undefined ? 1 : 0) + (instance.cpuId !== undefined ? 1 : 0) + (instance.harddriveId !== undefined ? 1 : 0)
    if (sum === 0) {
      throw new Error('one of gpuId, cpuId, harddriveId must be not null')
    }
    if (sum > 1) {
      throw new Error('only one of gpuId, cpuId and harddriveId must be not null')
    }
  }
}
