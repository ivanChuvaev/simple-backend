import { InferAttributes } from "sequelize"
import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "@/models"

@Table({ tableName: 'refresh_token' })
export default class RefreshToken extends Model<InferAttributes<RefreshToken>, { token: string, userId: number }> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    primaryKey: true
  })
  token!: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
    validate: {
      async maxCount(value: string) {
        if (await RefreshToken.count({ where: { userId: value }}) > 5) {
          throw new Error('one user cannot have more than 5 refresh tokens')
        }
      }
    }
  })
  userId!: number

  @BelongsTo(() => User)
  user!: User
}
