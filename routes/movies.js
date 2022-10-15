const express = require('express');
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const router = express.Router();
const { createdMovie, removeMovie, getMovies } = require('../controllers/movies');

router.post('/', express.json(), celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
    trailerLink: Joi.string().required().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
    thumbnail: Joi.string().required().pattern(/https?:\/\/(?:[-\w]+\.)?([-\w]+)\.\w+(?:\.\w+)?\/?.*/i),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createdMovie);
router.delete('/:movieId', express.json(), celebrate({
  params: Joi.object().keys({
    movieId: Joi.objectId(),
  }),
}), removeMovie);
router.get('/', express.json(), getMovies);

module.exports = router;
