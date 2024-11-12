// modules/todos/todo.controller.js

const todoModel = require("./todo.model");
const logger = require("../../middleware/logger");

// Controller Function: Get Todos
const getTodos = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const todos = await todoModel.getTodos(req.user.id, limit, offset);
    res.status(200).json({ todos });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

// Controller Function: Create Todo
const createTodo = async (req, res, next) => {
  try {
    let { title, description = "", due_date = "", priority = 0 } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    console.log("makanan");

    const newTodo = await todoModel.createTodo({
      user_id: req.user.id, // Assuming req.user contains 'id'
      title,
      description,
      due_date,
      priority,
    });

    res.status(201).json({ success: true, todo: newTodo });
  } catch (exception) {
    console.log("exception", exception); // Fixed typo
    logger.error(exception);
    next(exception);
  }
};

// Additional Controller Functions: Update Todo, Delete Todo (to be implemented)

module.exports = {
  getTodos,
  createTodo,
  // Add other controller functions as needed
};
