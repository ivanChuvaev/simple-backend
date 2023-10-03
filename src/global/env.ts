import _ from 'lodash'
import dotenv from 'dotenv'
import { Dialect } from 'sequelize';

let tmpENV: any = {};
dotenv.config({ processEnv: tmpENV })

// set this constants in .env file
const envArr = [
  'PORT',
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DIALECT',
  'DB_HOST',
  'DB_PORT',
  'DB_TIMEZONE'
] as const

type ENVType = Record<typeof envArr[number], string> & {
  DB_DIALECT: Dialect
}

for (const key of envArr) {
  if (tmpENV[key] === undefined) {
    throw new Error(`${key} is undefined, you should set it in your .env file`)
  }
}

const DialectRunType = ["mysql", "postgres", "sqlite", "mariadb", "mssql", "db2", "snowflake", "oracle"] as const
if (!DialectRunType.includes(tmpENV.DB_DIALECT as any)) {
  throw new Error(`DB_DIALECT ${tmpENV.DB_DIALECT} is not Dialect that Sequelize can understand`)
}

const env = _.fromPairs(_.map(envArr, key => [key, tmpENV[key]])) as ENVType

export default env;
