import env from "@/global/env";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

export function authMiddleware(req: Request, res: Response) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No credentials sent!' });
  }
  const [bearer, token] = req.headers.authorization.split(' ')
  if (bearer !== 'Bearer') {
    return res.status(400).json({ error: 'bearer token does not have "Bearer" keyword'})
  }
  try {
    const decoded = jwt.verify(token, env.SECRET_KEY) as { exp: number }
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('bearer token is expired')
    }
  } catch(e: any) {
    return res.status(401).json({ error: e.message })
  }
}
