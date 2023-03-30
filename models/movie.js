const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  // страна создания фильма
  country: {
    type: String,
    require: true,
  },
  //  режиссёр фильма
  director: {
    type: String,
    require: true,
  },
  // длительность фильма
  duration: {
    type: Number,
    require: true,
  },
  // год выпуска фильма
  year: {
    type: String,
    require: true,
  },
  // описание фильма
  description: {
    type: String,
    require: true,
  },
  // ссылка на постер к фильму
  image: {
    type: String,
    require: true,
    match: /^((http|https):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i,
  },
  // ссылка на трейлер фильма
  trailerLink: {
    type: String,
    require: true,
    match: /^((http|https):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i,
  },
  // миниатюрное изображение постера к фильму
  thumbnail: {
    type: String,
    require: true,
    match: /^((http|https):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i,
  },
  //  _id пользователя, который сохранил фильм
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  // id фильма, который содержится в ответе сервиса MoviesExplorer
  movieId: {
    type: Number,
    require: true,
  },
  // название фильма на русском языке
  nameRU: {
    type: String,
    require: true,
  },
  // название фильма на английском языке
  nameEN: {
    type: String,
    require: true,
  },

});

module.exports = mongoose.model('movie', movieSchema);
