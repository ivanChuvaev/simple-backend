import { User } from '@/models'
import { Request, Response, Router } from 'express'
import { Schema, checkSchema, validationResult } from 'express-validator'

type ReqBody = {
  data: {
    email: string
    password: string
  }
}

const schema: Schema = {
  'data': {
    exists: {
      errorMessage: '"data" is not provided'
    }
  },
  'data.email': {
    isEmail: {
      errorMessage: 'Неверная почта'
    },
    exists: {
      errorMessage: 'Почта обязательна',
    },
  },
  'data.password': {
    exists: {
      errorMessage: 'Пароль обязателен'
    }
  }
}

export default async (app: Router) => {
  app.post('/auth/sign-up', checkSchema(schema), async (req: Request<any, any, ReqBody>, res: Response) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const user = await User.findOne({ where: { email: req.body.data.email }})
      if (user !== null) {
        res.status(400);
        res.json({
          error: 'Такая почта уже используется'
        })
        return
      }

      try {
        await User.create({ email: req.body.data.email, password: req.body.data.password })
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
