// modules/todos/todo.model.js

const db = require("../../utils/db");

const createTodo = async ({ user_id, title, description, due_date, priority }) => {
  const result = await db.query(
    `
    INSERT INTO todos (user_id, title, description, due_date, priority)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, description, is_completed, is_deleted, due_date, priority, created_at, updated_at
  `,
    [user_id, title, description, due_date, priority] // Corrected
  );

  return result.rows[0];
};

module.exports = {
  createTodo,
};
