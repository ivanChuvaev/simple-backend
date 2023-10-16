import { RefreshToken, User } from '@/models'
import { Request, Response, Router } from 'express'
import { Schema, checkSchema } from 'express-validator'

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
  }
}

export default async (app: Router) => {
  app.get('/auth/logout', checkSchema(schema), async (req: Request<any,any,ReqBody>, res: Response) => {
    await RefreshToken.destroy({ where: { token: req.body.data.refreshToken }})
    res.sendStatus(200);
  })
}
