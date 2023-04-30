import { Request, Response, NextFunction } from 'express';
import ValidationErr from '../errors/validation-err';
import User from '../models/user';
import NotFoundErr from '../errors/not-found-err';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => {
    if (!users) throw new Error();
    res.send({ data: users });
  })
  .catch(() => {
    next(new NotFoundErr('Пользователи не найдены'));
  });

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) throw new Error();
      res.send({ data: user });
    })
    .catch(() => {
      next(new NotFoundErr('Нет пользователя с таким id'));
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => {
      if (!user) throw new Error();
      res.send({ data: user });
    })
    .catch(() => next(new ValidationErr('Переданы некорректные данные')));
};

export const updateProfile = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (!user) throw new Error();
      res.send({ data: user });
    })
    .catch(() => next(new ValidationErr('Переданы некорректные данные')));
};

export const updateAvatar = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) throw new Error();
      res.send({ data: user });
    })
    .catch(() => next(new ValidationErr('Переданы некорректные данные')));
};
