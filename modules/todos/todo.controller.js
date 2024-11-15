// modules/todos/todo.controller.js

const todoModel = require("./todo.model");
const logger = require("../../middleware/logger");
const moment = require("moment");

// Controller Function: Get Todos
const testTodos = async (req, res, next) => {
  try {
    res.status(200).json({ success: "hi" });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description = "", due_date = null, priority = 0 } = req.body;

    const formattedDueDate = due_date ? moment(due_date, "MM/DD/YYYY").format("YYYY-MM-DD") : null;
    console.log("formattedDueDate", formattedDueDate);
    console.log("beforetheformat", due_date);
    const newTodo = await todoModel.createTodo({
      userId,
      title,
      description,
      due_date: formattedDueDate,
      priority,
    });

    // Change the date for due-date
    newTodo.due_date = newTodo.due_date
      ? moment(newTodo.due_date, "MM/DD/YYYY").format("YYYY-MM-DD")
      : null;

    res.status(201).json({ success: true, todo: newTodo });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

const getTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const todos = await todoModel.getTodo(userId, limit, offset);
    res.status(200).json({ todos });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todoId = req.params.id;

    const todo = await todoModel.getTodoById(userId, todoId);
    return res.status(200).json({
      success: true,
      todo: todo,
    });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todoId = parseInt(req.params.id, 10);
    if (isNaN(todoId)) {
      return res.status(400).json({
        error: "Invalid Todo ID",
      });
    }
    const deleted = await todoModel.deleteTodo(userId, todoId);
    if (!deleted) {
      return res.status(404).json({ error: "Todo not found or already deleted" });
    }

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const todoId = parseInt(req.params.id, 10);
    const { title, description, due_date, priority, is_completed } = req.body;
    if (isNaN(todoId)) {
      return res.status(400).json({
        error: "Invalid Todo ID",
      });
    }

    const updatedTodo = await todoModel.updateTodo(userId, todoId, {
      title,
      description,
      due_date,
      priority,
      is_completed,
    });

    if (!updatedTodo) {
      return res.status(400).json({ error: "Todo not found or already deleted" });
    }
    res.status(200).json({ success: true, todo: updatedTodo });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

module.exports = {
  testTodos,
  createTodo,
  getTodo,
  getTodoById,
  deleteTodo,
  updateTodo,
  // Add other controller functions as needed
};
