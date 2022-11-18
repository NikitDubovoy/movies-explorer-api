const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;
const AccessError = require("../errors/AccessError");
const IsEmail = require("../errors/IsEmail");
const InvalidAuth = require("../errors/InvalidAuth");
const IsNotFound = require("../errors/IsNotFound");
const IsServerError = require("../errors/IsServerError");
const IsCastError = require("../errors/IsCastError");

const createdUser = (req, res, next) => {
  const { name, password, email } = req.body;
  bcrypt.hash(password, 10).then((hashPassword) => {
    User.create({
      name,
      password: hashPassword,
      email,
    })
      .then((user) => res.status(200).send(user))
      .catch((e) => {
        if (e.name === "ValidationError") {
          next(new AccessError("Неверные данные"));
        } else if (e.code === 11000) {
          next(new IsEmail("Пользователь с таким Email сущствует"));
        } else {
          next(e);
        }
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .orFail(() => new InvalidAuth("Неверный логин или пароль"))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign(
              {
                _id: user._id,
              },
              NODE_ENV === "production" ? JWT_SECRET : "dev-secret"
            );
            res.cookie("jwt", token, {
              maxAge: 60480000,
              httpOnly: true,
              sameSite: true,
            });
            res.status(200).send(user);
          } else {
            next(new InvalidAuth("Невенрые данные"));
          }
        })
        .catch(next);
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie("jwt").send({ message: "Успешный выход" });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const { _id } = req.user;
  User.findOne({ email })
    .then((users) => {
      /*       if (!users) { */
      User.findByIdAndUpdate(_id, { email, name }, { runValidators: true })
        .then((user) => {
          if (!user) {
            next(new IsNotFound("Пользователь не найден"));
            return;
          }
          res.status(200).send(user);
        })
        .catch(() => next(new IsServerError("Ошибка сервера")));
      /*       } else {
        next(new InvalidAuth("Такой email уже существует"));
      } */
    })
    .catch(() => next(new IsServerError("Ошибка сервера")));
};

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => {
      if (!user) {
        next(new IsNotFound("Пользователь не найден"));
        return;
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      if (e.name === "CastError") {
        next(new IsCastError("Неверные данные"));
        return;
      }
      next(new IsServerError("Ошибка сервера"));
    });
};

module.exports = {
  createdUser,
  getUser,
  login,
  logout,
  updateUser,
};
