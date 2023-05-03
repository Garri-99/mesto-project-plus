import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthErr from '../errors/auth-err';

dotenv.config();

const { JWT_SECRET = 'secret' } = process.env;

export default (
  req: Request & { user?: string | jwt.JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthErr('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new AuthErr('Необходима авторизация'));
  }
  req.user = payload;

  return next();
};
