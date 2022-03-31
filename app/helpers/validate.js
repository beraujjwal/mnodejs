const Validator = require('validatorjs');
const Models = require('../../system/core/model/index');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

/**
 * Checks if incoming value already exist for unique and non-unique fields in the database
 * e.g email: required|email|unique:User,email
 */
Validator.registerAsync('unique', async (value, attribute, req, passes) => {
  if (!attribute) {
    passes(false, 'Specify Requirements i.e fieldName: unique:table,column');
    return;
  }

  //split table and column
  let attArr = attribute.split(',');
  if (attArr.length < 1) {
    passes(false, `Invalid format for validation rule on ${attribute}`);
    return;
  }

  //assign array index 0 and 1 to table and column respectively
  const { 0: table, 1: column, 2: pk, 3: pkvalue } = attArr;
  //define custom error message
  let msg =
    column == 'username'
      ? `This ${column} has already been taken.`
      : `This ${column} is already associated with an account.`;
  //check if incoming value already exists in the database
  let criteria = { [column]: value, verified: true, deleted: false };
  if (pk != null && pkvalue != null) {
    criteria = { ...criteria, [pk]: { $ne: pkvalue } };
  }

  let user = await Models[table].findOne(criteria);

  if (user) {
    passes(false, msg); // return false if value exists
    return;
  }

  passes();
  return;
});

/**
 * Checks if incoming value is greater than attribute
 * e.g phone: required|length:10
 */
Validator.register(
  'length',
  (value, attribute) => {
    if (!attribute) throw new Error('Specify Requirements i.e length:10');

    if (isNaN(parseInt(attribute)))
      throw new Error(
        `Invalid format of validation rule on length:${attribute}`,
      );

    //check if incoming value max size
    if (parseInt(value.length) !== parseInt(attribute)) {
      //passes(false, msg); // return false if value exists
      return false;
    }
    //passes();
    return;
  },
  'The :attribute value length is not matching.',
);

/**
 * Checks if incoming value tighten password policy
 * e.g password: strict
 */
Validator.register(
  'strict',
  (value) => passwordRegex.test(value),
  'password must contain at least one uppercase letter, one lowercase letter and one number',
);

/**
 * Checks if incoming value valid with XXX-XXX-XXXX format
 * e.g phone: telephone
 */
Validator.register(
  'telephone',
  (value) => {
    // requirement parameter defaults to null
    return value.match(/^\d{3}-\d{3}-\d{4}$/);
  },
  'The :attribute phone number is not in the format XXX-XXX-XXXX.',
);

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;
