// modules/todos/todo.router.js

const express = require("express");
const todoController = require("./todo.controller");
const {
  validateCreateTodo,
  validateGetTodo,
  validateGetTodoById,
  validateUpdateTodo,
} = require("../../middleware/validation");

const router = express.Router();

// Route: GET /api/todos
// router.get("/", todoController.getTodos);
router.get("/test", todoController.testTodos);
router.post("/create", validateCreateTodo, todoController.createTodo);
router.get("/", validateGetTodo, todoController.getTodo);
router.get("/:id", validateGetTodoById, todoController.getTodoById);
router.put("/:id", validateUpdateTodo, todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
