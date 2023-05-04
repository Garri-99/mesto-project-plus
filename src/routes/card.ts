import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { isObjectIdOrHexString } from 'mongoose';
import {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/card';

const router = Router();

router.get('/cards', getCards);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((v) => {
      if (!isObjectIdOrHexString(v)) {
        throw new Error('Некорректный id');
      }
      return v;
    }),
  }),
}), deleteCard);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
}), createCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((v) => {
      if (!isObjectIdOrHexString(v)) {
        throw new Error('Некорректный id');
      }
      return v;
    }),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((v) => {
      if (!isObjectIdOrHexString(v)) {
        throw new Error('Некорректный id');
      }
      return v;
    }),
  }),
}), dislikeCard);

export default router;
