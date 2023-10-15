import { Express, Request, Response } from 'express'
import path from 'path'

export default async (app: Express) => {
  app.get('/', async (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), 'public/sign-in.html'))
  })
}
