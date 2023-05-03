import winston from 'winston';
import expressWinston from 'express-winston';

import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  maxFiles: '3d',
  zippedArchive: true,
});

export const requestLogger = expressWinston.logger({
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({
      filename: 'request.log',
    }),
  ],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});
