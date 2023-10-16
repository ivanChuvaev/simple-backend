import { authMiddleware } from '@/middlewares/authMiddleware'
import { User } from '@/models'
import { Request, Response, Router } from 'express'

export default async (app: Router) => {
  app.get('/protected/get-all-users', authMiddleware, async (req: Request, res: Response) => {
    try {
      const users = await User.findAll();
      res.status(200).json({
        data: users.map( user => user.dataValues )
      })
    } catch(e: any) {
      res.status(500).json({ error: e.message })
    }
  })
}
