const router = require('express').Router();
const express = require('express');

const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
Joi.objectId = require('joi-objectid')(Joi);

const { createdUser, login } = require('../controllers/users');

router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createdUser);

router.use(auth, express.json());
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => {
  next('Ошибка странциа не найдена');
});

module.exports = router;
