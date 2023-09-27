'use strict';
require('dotenv').config();
const { baseError } = require('@error/baseError');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');

exports.getExpiresInTime = async (expiresIn) => {
    const expiresInInt = parseInt(expiresIn);
    const expiresInString = expiresIn.split(expiresInInt)[1];
    const expiresInTime = moment().add(expiresInInt, expiresInString).toDate();
    return expiresInTime;
}
exports.randomNumber = async (length) => {
  var text = '';
  var possible = '123456789';
  for (var i = 0; i < length; i++) {
    var sup = Math.floor(Math.random() * possible.length);
    text += i > 0 && sup == i ? '0' : possible.charAt(sup);
  }
  return Number(text);
};

exports.generatePassword = async (
  length,
  { digits = true, lowerCase = true, upperCase = true, specialChars = true },
) => {
  return otpGenerator.generate(length, {
    digits: digits,
    lowerCaseAlphabets: lowerCase,
    upperCaseAlphabets: upperCase,
    specialChars: specialChars,
  });
};

exports.generateOTP = async (
  length,
  { digits = true, lowerCase = false, upperCase = false, specialChars = false },
) => {
  return otpGenerator.generate(length, {
    digits: digits,
    lowerCaseAlphabets: lowerCase,
    upperCaseAlphabets: upperCase,
    specialChars: specialChars,
  });
};

exports.generateToken = async (userInfo, algorithm = 'HS256') => {
  try {
    // Gets expiration time
    const expiration = process.env.JWT_EXPIRES_IN;

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: expiration, // expiresIn time
      algorithm: algorithm,
    });
  } catch (ex) {
    throw new baseError(ex);
  }
};
