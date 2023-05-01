import { Request, Response, NextFunction } from 'express';
import ValidationErr from '../errors/validation-err';
import User from '../models/user';
import NotFoundErr from '../errors/not-found-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => {
    res.send({ data: users });
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
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const updateProfile = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new NotFoundErr('Нет пользователя с таким id'));
      else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const updateAvatar = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) next(new NotFoundErr('Нет пользователя с таким id'));
      else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};
