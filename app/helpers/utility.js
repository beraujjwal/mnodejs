'use strict';
require('dotenv').config();
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
exports.randomNumber = (length) => {
  var text = '';
  var possible = '123456789';
  for (var i = 0; i < length; i++) {
    var sup = Math.floor(Math.random() * possible.length);
    text += i > 0 && sup == i ? '0' : possible.charAt(sup);
  }
  return Number(text);
};

exports.generatePassword = function (
  length,
  { digits = true, lowerCase = true, upperCase = true, specialChars = true },
) {
  return otpGenerator.generate(length, {
    digits: digits,
    lowerCaseAlphabets: lowerCase,
    upperCaseAlphabets: upperCase,
    specialChars: specialChars,
  });
};

exports.generateOTP = function (
  length,
  { digits = true, lowerCase = false, upperCase = false, specialChars = false },
) {
  return otpGenerator.generate(length, {
    digits: digits,
    lowerCaseAlphabets: lowerCase,
    upperCaseAlphabets: upperCase,
    specialChars: specialChars,
  });
};

exports.generateToken = function (userInfo, algorithm = 'HS256') {
  try {
    // Gets expiration time
    const expiration =
      Math.floor(Date.now() / 1000) + 60 * process.env.JWT_EXPIRES_IN;

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: expiration, // expiresIn time
      algorithm: algorithm,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
