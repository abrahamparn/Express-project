const db = require("../../utils/db");

const checkUsername = async (username) => {
  const result = await db.query(
    `SELECT EXISTS (SELECT 1 FROM users WHERE username = $1) AS "exists"`,
    [username]
  );
  return result.rows[0].exists;
};

const createUser = async (username, password, name) => {
  const result = await db.query(
    `INSERT INTO users (username, password, name) VALUES ($1, $2, $3) 
     RETURNING username`,
    [username, password, name]
  );
  return result.rows[0].username;
};

const deleteOneUser = async (username) => {
  const result = await db.query(`DELETE FROM users WHERE username = $1`, [username]);
  return result.rowCount > 0; // Returns true if at least one row was deleted
};

const selectOneUser = async (username) => {
  const result = await db.query(`SELECT * FROM users WHERE username = $1`, [username]);
  return result.rows[0];
};

const updatePassword = async (username, hashedPassword) => {
  const result = await db.query(
    `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2 
     RETURNING username`,
    [hashedPassword, username]
  );
  return result.rows[0];
};

module.exports = {
  checkUsername,
  createUser,
  deleteOneUser,
  selectOneUser,
  updatePassword,
};
