const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT, MONGO_URL } = process.env;
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const IsServerError = require('./errors/IsServerError');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://movies2.nomoredomains.icu',
    'https://movies2.nomoredomains.icuu',
  ],
  credentials: true,
}));
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(requestLogger);

app.use(cookieParser());
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(IsServerError);

app.listen(PORT, () => {
});
