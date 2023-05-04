import { NextFunction, Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import Card from '../models/card';
import ValidationErr from '../errors/validation-err';
import NotFoundErr from '../errors/not-found-err';
import ForbiddenErr from '../errors/forbidden-err';

export const createCard = (
  req: Request & { user?: { _id: ObjectId } },
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    res.send({ data: cards });
  })
  .catch(next);

export const deleteCard = (
  req: Request & { user?: { _id: string } },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundErr('Нет карточки с таким id'));
      }
      if (card.owner.toString() !== req.user?._id) {
        return next(
          new ForbiddenErr('Вы не можете удалять карточки других пользователей'),
        );
      }
      return card.deleteOne().then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const likeCard = (
  req: Request & { user?: { _id: ObjectId } },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) next(new NotFoundErr('Нет карточки с таким id'));
      else res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};

export const dislikeCard = (
  req: Request & { user?: { _id: ObjectId } },
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) next(new NotFoundErr('Нет карточки с таким id'));
      else res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationErr('Переданы некорректные данные'));
      }
      return next(err);
    });
};
