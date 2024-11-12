// modules/todos/todo.router.js

const express = require("express");
const todoController = require("./todo.controller");
const { validateTodo } = require("../../middleware/validation");

const router = express.Router();

// Route: GET /api/todos
router.get("/", todoController.getTodos);

// // Route: POST /api/todos/create
// router.post("/create", validateTodo, todoController.createTodo);

// Additional Routes: PUT /api/todos/:id, DELETE /api/todos/:id (to be implemented)

module.exports = router;
