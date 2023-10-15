import { Session, User } from '@/models'
import { Express, Request, Response } from 'express'
import { Schema, checkSchema, validationResult } from 'express-validator'

const schema: Schema = {
  login: {
    exists: {
      errorMessage: 'login must be provided'
    },
  },
  password: {
    exists: {
      errorMessage: 'password must be provided'
    }
  }
}

export default async (app: Express) => {
  app.post('/auth/sign-in', checkSchema(schema), async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({
        error: errors.array()[0].msg
      })
      return
    }

    const user = await User.findOne({ where: { login: req.body.login }})
    
    if (user === null) {
      res.status(404);
      res.json({
        error: 'incorrect login'
      })
      return
    }

    const samePassword = await user.comparePassword(req.body.password)

    if (!samePassword) {
      res.status(401);
      res.json({
        error: 'incorrect password'
      })
      return
    }
    
    res.status(200);

    try {
      const session = await Session.create({ userId: user.id });
      res.json({
        sessionId: session.sessionId
      })
    } catch (e: any) {
      res.status(400);
      res.json({
        error: e.errors[0].message
      })
    }
  })
}
