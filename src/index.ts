import path from 'path'
import cors from 'cors'
import express from 'express'
import initializeControllers from '@controllers'
import initializeModels from '@models'
import env from "global/env";
import seq from "global/seq";

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, '../public')))

// initializes all models from ./models directory, including subdirectories
initializeModels(seq)
// initializes all controllers from ./controllers directory, including subdirectories
initializeControllers(app)

app.listen(env.PORT, () => {
  console.log(`started listening on port ${env.PORT}`)
})
