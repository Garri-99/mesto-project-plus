import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
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
    userId: Joi.string().required().alphanum(),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateProfile);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
}), updateAvatar);

export default router;
