import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import ValidationErr from '../errors/validation-err';
import User from '../models/user';
import NotFoundErr from '../errors/not-found-err';
import ConflictErr from '../errors/conflict-err';

dotenv.config();

const { JWT_SECRET = 'secret' } = process.env;

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => {
    res.send({ data: users });
  })
  .catch(next);

export const getUserInfo = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => User.findById(req.user?._id)
  .then((user) => {
    res.send({ data: user });
  })
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) next(new NotFoundErr('Нет пользователя с таким id'));
      else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name,
          about: user.about,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr('Пользователь с таким email уже есть'));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const updateProfile = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new NotFoundErr('Нет пользователя с таким id'));
      else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const updateAvatar = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new NotFoundErr('Нет пользователя с таким id'));
      else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};
