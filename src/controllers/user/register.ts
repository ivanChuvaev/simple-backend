import { User } from '@models'
import { Express, Request, Response } from 'express'
import { Schema, checkSchema, validationResult } from 'express-validator'

const schema: Schema = {
  login: {
    exists: {
      errorMessage: 'login must be provided',
    },
  },
  password: {
    exists: {
      errorMessage: 'password must be provided'
    }
  }
}

export default async (app: Express) => {
  app.post('/user/register', checkSchema(schema), async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const user = await User.findOne({ where: { login: req.body.login }})
      if (user !== null) {
        res.status(400);
        res.json({
          error: 'login already in use'
        })
        return
      }

      try {
        await User.create({ login: req.body.login, password: req.body.password })
      } catch (e: any) {
        if (e.type === 'Validation error') {
          res.status(400)
        } else {
          res.status(500)
        }
        res.json({
          error: e.errors[0].message
        })
        return
      }

      res.sendStatus(200);
      return;
    }

    res.status(400);
    res.json({
      error: errors.array()[0].msg
    })
  })
}
