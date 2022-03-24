const otpGenerator = require('otp-generator');
exports.randomNumber = function (length) {
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
