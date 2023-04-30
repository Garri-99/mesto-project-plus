import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import ValidationErr from '../errors/validation-err';
import NotFoundErr from '../errors/not-found-err';

export const createCard = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;
  return Card.create(
    { name, link, owner: req.user._id },
    { runValidators: true },
  )
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    res.send({ data: cards });
  })
  .catch(next);

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) next(new NotFoundErr('Нет карточки с таким id'));
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const likeCard = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) next(new NotFoundErr('Нет карточки с таким id'));
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const dislikeCard = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) next(new NotFoundErr('Нет карточки с таким id'));
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};
