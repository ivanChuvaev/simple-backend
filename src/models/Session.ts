import { InferAttributes } from "sequelize"
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "@/models"
import dayjs from "dayjs"

@Table({ tableName: 'session' })
export default class Session extends Model<InferAttributes<Session>, { userId: number, expires?: Date }> {
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  sessionId!: number

  @Column({
    type: DataType.DATE,
    defaultValue: dayjs().add(1, 'month').toDate()
  })
  expires!: Date

  @ForeignKey(() => User)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    validate: {
      async maxCount(value: string) {
        if (await Session.count({ where: { userId: value }}) >= 5) {
          throw new Error('one user cannot have more than 5 sessions')
        }
      }
    }
  })
  userId!: number

  @BelongsTo(() => User)
  user!: User

}
