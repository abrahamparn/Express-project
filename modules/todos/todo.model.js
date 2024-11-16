// modules/todos/todo.model.js

const db = require("../../utils/db");

const createTodo = async ({ userId, title, description, due_date, priority }) => {
  const result = await db.query(
    `
    INSERT INTO todos (user_id, title, description, due_date, priority)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, description, is_completed, is_deleted, due_date, priority, created_at, updated_at
  `,
    [userId, title, description, due_date, priority] // Corrected
  );

  return result.rows[0];
};

const getTodo = async (userId, limit, offset) => {
  const result = await db.query(
    `
    SELECT id, title, description, is_completed, is_deleted, due_date, priority, created_at, updated_at
    FROM todos
    WHERE user_id = $1 AND is_deleted = FALSE
    ORDER BY ID ASC
    LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset]
  );

  return result.rows;
};

const getTodoById = async (userId, todoId) => {
  const result = await db.query(
    `
    SELECT id, title, description, is_completed, is_deleted, due_date, priority, created_at, updated_at
    FROM todos
    WHERE user_id = $1 AND id = $2 AND is_deleted = FALSE
    `,
    [userId, todoId]
  );
  return result.rows[0];
};

const updateTodo = async (userId, todoId, updates) => {
  const { title, description, due_date, priority, is_completed } = updates;

  const result = await db.query(
    `
    UPDATE todos
    SET title = COALESCE($1, title),
      description = COALESCE($2, description),
      due_date = COALESCE($3, due_date),
      priority = COALESCE($4, priority),
      is_completed = COALESCE($5, is_completed),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 AND user_id = $7 AND is_deleted = FALSE
    RETURNING id, title, description, is_completed, is_deleted, due_date, priority, created_at, updated_at
    `,
    [title, description, due_date, priority, is_completed, todoId, userId]
  );
  return result.rows[0];
};

const deleteTodo = async (userId, todoId) => {
  const result = await db.query(
    `
    UPDATE todos
    SET is_deleted = TRUE, updated_at = CURRENT_TIMESTAMP
    WHERE id=$1 AND user_id = $2 AND is_deleted = FALSE
    `,
    [todoId, userId]
  );

  return result.rowCount > 0;
};

module.exports = {
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
};
