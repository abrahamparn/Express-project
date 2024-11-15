const { param, query, body, validationResult } = require("express-validator");
const moment = require("moment");

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

const validateCreateTodo = [
  body("title").notEmpty().withMessage("Title is required"),
  body("priority")
    .optional()
    .isInt({ min: 0, max: 9 })
    .withMessage("Priority must be a non-negative integer and less than 10"),
  body("due_date")
    .optional()
    .custom((value) => {
      // Define the expected format
      const format = "DD/MM/YYYY";

      // Check if the date matches the format and is valid
      if (!moment(value, format, true).isValid()) {
        throw new Error("Due date must be in dd/mm/yyyy format and a valid date");
      }

      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateGetTodo = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 2 })
    .withMessage("limit must a positive integer and should be more than one"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

const validateGetTodoById = [
  param("id")
    .exists()
    .withMessage("Todo ID is required")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("Todo ID must be a positive integer"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdateTodo = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty").trim().escape(),
  body("description").optional().trim().escape(),

  body("due_date")
    .optional()
    .custom((value) => {
      const format = "DD/MM/YYYY";

      if (!moment(value, format, true).isValid()) {
        throw new Error("Due date must be in dd/mm/yyyy format and a valid date");
      }

      return true;
    }),
  body("priority")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Priority must be a non-negative integer and less than 10"),
  body("is_completed").optional().isBoolean().withMessage("is_completed must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];
module.exports = {
  validateRegistration,
  validateCreateTodo,
  validateGetTodo,
  validateGetTodoById,
  validateUpdateTodo,
};
