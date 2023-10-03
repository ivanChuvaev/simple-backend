import { InferAttributes } from "sequelize"
import { AllowNull, AutoIncrement, BeforeCreate, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript"
import { Session } from "@models"
import bcrypt from 'bcrypt'

type CreationProps = {
  login: string
  password: string
}

@Table({ tableName: 'user' })
export default class User extends Model<InferAttributes<User>, CreationProps> {
  @Column({
    type: DataType.SMALLINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  id!: number

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      is: {
        args: /^[a-zа-я\d_]*$/i,
        msg: 'login can only be consists of case insensitive latin characters, digits and underscores'
      },
      len: {
        args: [3, 50],
        msg: 'login length must be between 3 and 50'
      },
      isStartWithCharacterOrUnderscore(value: string) {
        if (value.search(/^[a-zа-я_]/i) === -1) {
          throw new Error('login must starts with word character or underscore')
        }
      }
    }
  })
  login!: string

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [8, 50],
        msg: 'password length must be between 8 and 50'
      },
      hasNumber(value: string) {
        if (value.search(/\d/) === -1) {
          throw new Error('password must contain at least one digit')
        }
      },
      hasSpecialCharacter(value: string) {
        if (value.search(/[@$!%*#?&]/) === -1) {
          throw new Error('password must contain at least one special character')
        }
      },
      hasWordCharacterLowerCase(value: string) {
        if (value.search(/[a-zа-я]/) === -1) {
          throw new Error('password must contain at least one lower case character from latin or cyrillic alphabet')
        }
      },
      hasWordCharacterUpperCase(value: string) {
        if (value.search(/[A-ZА-Я]/) === -1) {
          throw new Error('password must contain at least one upper case character from latin or cyrillic alphabet')
        }
      },
    }
  })
  password!: string

  @HasMany(() => Session)
  sessions!: Session[]

  @BeforeCreate
  private static async passwordHook(user: User) {
    user.password = await User.hashPassword(user.password)
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10)
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password)
  }
}
