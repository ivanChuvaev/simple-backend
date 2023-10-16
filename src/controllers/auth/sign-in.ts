import env from '@/global/env'
import { RefreshToken, User } from '@/models'
import { Request, Response, Router } from 'express'
import { Schema, checkSchema, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

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
    exists: {
      errorMessage: 'Почта обязательна'
    },
    isEmail: {
      errorMessage: 'Неверная почта'
    },
  },
  'data.password': {
    exists: {
      errorMessage: 'Пароль обязателен'
    }
  }
}

export default async (app: Router) => {
  app.post('/auth/sign-in', checkSchema(schema), async (req: Request<any, any, ReqBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({
        error: errors.array()[0].msg
      })
      return
    }

    const user = await User.findOne({ where: { email: req.body.data.email }})
    
    if (user === null) {
      res.status(404);
      res.json({
        error: 'Пользователь с такой почтой уже существует'
      })
      return
    }

    const samePassword = await user.comparePassword(req.body.data.password)

    if (!samePassword) {
      res.status(401);
      res.json({
        error: 'Неверный пароль'
      })
      return
    }
    
    res.status(200);

    try {
      const accessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60 // 1 hour
      }, env.SECRET_KEY)
      const refreshToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 dayjs
      }, env.SECRET_KEY)
      const allTokens = await user.$get('refreshTokens', { order: [['createdAt', 'ASC']]})
      if (allTokens.length + 1 > 5) {
        allTokens[0].destroy();
      }
      await RefreshToken.create({ token: refreshToken, userId: user.id });
      res.json({
        accessToken,
        refreshToken
      })
    } catch (e: any) {
      res.status(400);
      res.json({
        error: e.message
      })
    }
  })
}
