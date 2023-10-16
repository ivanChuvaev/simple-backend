import env from '@/global/env'
import { RefreshToken, User } from '@/models'
import { Request, Response, Router } from 'express'
import { Schema, checkSchema, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

type ReqBody = {
  data: {
    refreshToken: string
  }
}

const schema: Schema = {
  'data': {
    exists: {
      errorMessage: '"data" is not provided'
    }
  },
  'data.refreshToken': {
    exists: {
      errorMessage: 'refresh token must be provided'
    }
  },
}

export default async (app: Router) => {
  app.post('/auth/revoke-token', checkSchema(schema), async (req: Request<any, any, ReqBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      res.json({
        error: errors.array()[0].msg
      })
      return
    }

    try {
      const decoded = jwt.verify(req.body.data.refreshToken, env.SECRET_KEY) as { exp: number }// will throw error if not verified
      
      if (decoded.exp < Date.now() / 1000) {
        await RefreshToken.destroy({ where: { token: req.body.data.refreshToken }})
        throw Error('refresh token is expired')
      }

      const refreshTokenDB = await RefreshToken.findOne({ where: { token: req.body.data.refreshToken }, include: User })
      if (refreshTokenDB === null) throw Error('refresh token is not found in database')
      
      res.status(200);

      await refreshTokenDB.destroy();
      const accessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60 // 1 hour
      }, env.SECRET_KEY)
      const refreshToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 dayjs
      }, env.SECRET_KEY)
      await RefreshToken.create({ token: refreshToken, userId: refreshTokenDB.user.id });
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
