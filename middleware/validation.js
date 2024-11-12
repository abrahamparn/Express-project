const { body, validationResult } = require("express-validator");

const validateRegistration = [
  body("username").isLength({ min: 6 }).withMessage("Username must be at least 6 characters"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("name").notEmpty().withMessage("Name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegistration,
};
