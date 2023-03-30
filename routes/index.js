const router = require('express').Router();
const express = require('express');

const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
Joi.objectId = require('joi-objectid')(Joi);
const IsNotFound = require('../errors/IsNotFound');

const { createdUser, login, logout } = require('../controllers/users');

router.post('/signin', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().required(),
  }),
}), login);

router.post('/signup', express.json(), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createdUser);

router.post('/signout', express.json(), logout);

router.use(auth, express.json());
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use((req, res, next) => {
  next(new IsNotFound('Страница не найдена'));
});

module.exports = router;
