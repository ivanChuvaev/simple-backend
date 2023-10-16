import path from 'path'
import cors from 'cors'
import express from 'express'
import initializeControllers from '@/controllers'
import initializeModels from '@/models'
import env from "global/env";
import seq from "global/seq";
import winston from 'winston'
import expressWinston from 'express-winston'

(async () => {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(express.static(path.resolve(__dirname, '../public')))
  
  // initializes all models from ./models directory, including subdirectories
  initializeModels(seq)
  await seq.sync()
  
  const router = express.Router();
  // initializes all controllers from ./controllers directory, including subdirectories
  initializeControllers(router)
  
  // app.use(expressWinston.logger({
  //   transports: [
  //     new winston.transports.Console()
  //   ],
  //   format: winston.format.combine(
  //     winston.format.colorize(),
  //     winston.format.json()
  //   ),
  //   meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  //   expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  //   colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  // }))
  
  app.use(router);
  
  app.listen(env.PORT, () => {
    console.log(`started listening on port ${env.PORT}`)
  })
})()

