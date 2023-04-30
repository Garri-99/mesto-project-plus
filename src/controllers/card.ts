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
  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) throw new Error();
      res.send({ data: card });
    })
    .catch(() => next(new ValidationErr('Переданы некорректные данные')));
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    if (!cards) throw new Error();
    res.send({ data: cards });
  })
  .catch(() => next(new NotFoundErr('Карточки не найдены')));

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) throw new Error();
      res.send({ data: card });
    })
    .catch(() => next(new NotFoundErr('Нет карточки с таким id')));
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
      if (!card) throw new Error();
      res.send({ data: card });
    })
    .catch(() => next(new NotFoundErr('Нет карточки с таким id')));
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
      if (!card) throw new Error();
      res.send({ data: card });
    })
    .catch(() => next(new NotFoundErr('Нет карточки с таким id')));
};
