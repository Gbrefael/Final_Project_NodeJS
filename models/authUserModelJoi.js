const JOI = require('joi');
const { keys } = require('lodash');

class AuthUserModelJOI {
  constructor(object) {
    this.username = object.username;
    this.email = object.email;
    this.password = object.password;
    this.biz = object.biz;
  }
  // The baseline / common denominator of validation for 2 more endpoint validation
  static #baselineValidation = {
    username: JOI.string().required().min(3).max(20),
    email: JOI.string().required().email().min(6).max(30),
    password: JOI.string()
      .regex(/^[a-zA-Z0-9]{8,30}$/)
      .required()
      .min(8)
      .max(12),
    biz: JOI.boolean(),
  };
  static #registerValidation = JOI.object(
    AuthUserModelJOI.#baselineValidation
  ).keys({ id: JOI.string().forbidden() });

  static #loginValidation = JOI.object(
    AuthUserModelJOI.#baselineValidation
  ).keys(
    { username: JOI.string().forbidden() },
    { biz: JOI.boolean().forbidden() }
  );

  validateRegistration() {
    const result = AuthUserModelJOI.#registerValidation.validate(this, {
      abortEarly: false,
    });

    return result.error ? result.error : null;
  }

  validateLogin() {
    const result = AuthUserModelJOI.#loginValidation.validate(this, {
      abortEarly: false,
    });

    return result.error ? result.error : null;
  }
}

module.exports = AuthUserModelJOI;
