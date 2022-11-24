const express = require('express');
const { Joi, celebrate } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();
const { getUser, updateUser } = require('../controllers/users');

router.get('/me', express.json(), getUser);
router.patch('/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(/^[A-Za-z0-9][A-Za-z0-9.\-_]*[A-Za-z0-9]*@([A-Za-z0-9]+([A-Za-z0-9-]*[A-Za-z0-9]+)*\.)+[A-Za-z]*$/),
  }),
}), updateUser);

module.exports = router;
