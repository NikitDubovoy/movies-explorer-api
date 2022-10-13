const express = require('express');
const { Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();
const { logout, getUser, updateUser } = require('../controllers/users');

router.post('/logout', express.json(), logout);
router.post('/me', express.json(), getUser);
router.patch('/me', express.json(), updateUser);

module.exports = router;
