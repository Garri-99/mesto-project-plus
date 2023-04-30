import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Partial<Request> & { user?: any }, res: Response, next) => {
  req.user = {
    _id: '644bc6a3d25dd48d36565f1b',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

// eslint-disable-next-line no-unused-vars
app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
});

app.listen(3000, () => {
  console.log(`App listening on port ${3000}`); // eslint-disable-line
});
