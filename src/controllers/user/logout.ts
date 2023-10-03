import { Session, User } from '@models'
import { Express, Request, Response } from 'express'

export default async (app: Express) => {
  app.post('/user/login', async (req: Request, res: Response) => {
    const sessionId = req.header('sessionId')
    if (sessionId !== undefined) {
      await Session.destroy({ where: { sessionId }})
    }
    User.findOne({ where: { }})
    res.sendStatus(200);
  })
}