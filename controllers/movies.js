const Movie = require("../models/movie");
/* const IsCastError = require('../errors/IsCastError'); */
const IsNotFound = require("../errors/IsNotFound");
const IsServerError = require("../errors/IsServerError");
const AccessError = require("../errors/AccessError");

const createdMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(err));
};

const removeMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById({ _id: movieId })
    .orFail(() => next(new IsNotFound("Фильм не найден")))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new AccessError("Фильм не был добавлен текущим пользователем"));
        return;
      }
      movie
        .remove()
        .then((dataMovie) => {
          res.status(200).send(dataMovie);
        })
        .catch(() => {
          next(new IsServerError("Ошибка сервера"));
        });
    })
    .catch(next);
};

const getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(() => next(new IsServerError("Ошибка сервера")));
};

module.exports = {
  createdMovie,
  removeMovie,
  getMovies,
};
