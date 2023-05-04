import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { isObjectIdOrHexString } from 'mongoose';
import {
  getUserInfo,
  getUserById,
  getUsers,
  updateAvatar,
  updateProfile,
} from '../controllers/user';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((v) => {
      if (!isObjectIdOrHexString(v)) {
        throw new Error('Некорректный id');
      }
      return v;
    }),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
}), updateAvatar);

export default router;
