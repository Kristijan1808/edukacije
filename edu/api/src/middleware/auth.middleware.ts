import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: JwtPayload & { sub: string; email: string; role: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response | void {
  const queryToken = typeof req.query.token === 'string' ? req.query.token : undefined;
  const authorization = req.headers.authorization || (queryToken ? `Bearer ${queryToken}` : '');
  if (!authorization) return res.status(401).json({ message: 'Prijava je obavezna.' });

  try {
    req.user = jwt.verify(authorization.replace(/^Bearer\s+/i, ''), env.jwtSecret) as AuthRequest['user'];
    next();
  } catch {
    return res.status(401).json({ message: 'Neispravna sesija.' });
  }
}
