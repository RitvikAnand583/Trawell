const validator = require('validator');

/**
 * Validate signup request body. Throws a ValidationError with an `errors` object
 * mapping field names to messages when validation fails.
 * @param {Object} req - Express request object (expects req.body)
 */
const validSignUpData = (req) => {
    const { firstName, age, emailId, password } = req.body;
    const errors = {};

    if (!firstName || String(firstName).trim().length === 0) {
        errors.firstName = 'First name is required';
    }

    if (typeof age === 'undefined' || age === null || isNaN(Number(age))) {
        errors.age = 'Age is required and must be a number';
    } else if (Number(age) < 18 || Number(age) > 80) {
        errors.age = 'Age must be between 18 and 80 years';
    }

    if (!emailId || !validator.isEmail(String(emailId))) {
        errors.emailId = 'Please provide a valid email address';
    }

    if (!password || !validator.isStrongPassword(String(password))) {
        errors.password = 'Password must be strong: minimum 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol';
    }

    if (Object.keys(errors).length > 0) {
        const err = new Error('Validation failed');
        err.name = 'ValidationError';
        err.errors = errors;
        throw err;
    }
};

/**
 * Validate update request body. Returns true if only allowed fields are present.
 * Throws an Error for missing/invalid required update fields.
 * @param {Object} req - Express request object (expects req.body)
 * @returns {boolean}
 */
const validUpdateData = (req) => {
  const { firstName, lastName, gender, image, age, about } = req.body;
  const user = req.body;
  const ALLOWED_UPDATES = ['firstName', 'lastName', 'gender', 'image', 'age', 'about'];
  const isEditAllowed = Object.keys(user).every((key) => ALLOWED_UPDATES.includes(key));

  if (!firstName) throw new Error('First name is required');
  if (!lastName) throw new Error('Last name is required');
  if (!gender) throw new Error('Gender is required');
  if (!['male', 'female', 'others'].includes(gender.toLowerCase())) throw new Error('Gender must be one of: male, female, or others');
  if (age < 18 || age > 80) throw new Error('Age must be between 18 and 80 years');

  return isEditAllowed;
};

// Export validation functions
module.exports = {
    validSignUpData,
    validUpdateData,
};