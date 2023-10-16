import { Request, Response, Router } from 'express'
import path from 'path'

export default async (app: Router) => {
  app.get('/', async (req: Request, res: Response) => {
    res.sendFile(path.resolve(process.cwd(), 'public/sign-in.html'))
  })
}
