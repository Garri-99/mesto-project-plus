import { Schema, model } from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt: Schema.Types.Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат ссылки',
    },
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

export default model('card', cardSchema);
