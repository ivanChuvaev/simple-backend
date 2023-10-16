import { Sequelize } from 'sequelize-typescript'
import env from "./env";

const seq = new Sequelize({
  // logging: false,
  database: env.DB_NAME,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  dialect: env.DB_DIALECT,
  dialectOptions: { useUTC: false },
  host: env.DB_HOST,
  port: Number.parseInt(env.DB_PORT),
  timezone : env.DB_TIMEZONE
})

export default seq;
