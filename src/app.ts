import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors, celebrate, Joi } from 'celebrate';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import NotFoundErr from './errors/not-found-err';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/loggers';

dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avagar: Joi.string().uri(),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use(() => {
  throw new NotFoundErr('Cтраница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use(
  (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { statusCode = 500, message } = err;
    res.status(statusCode).send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });

    next();
  },
);

app.listen(PORT === 3000 ? 3000 : parseInt(PORT, 10), () => {
  console.log(`App listening on port ${PORT}`); // eslint-disable-line
});
