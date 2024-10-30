const db = require("../utils/db");

const checkUsername = async (username) => {
  const result = await db.query(`SELECT EXISTS (SELECT 1 FROM users WHERE username = ($1))`, [
    username,
  ]);
  return result.rows[0];
};

const createUser = async (username, password, name) => {
  const result = await db.query(
    `INSERT INTO USERS (username, password, name) VALUES ($1, $2, $3) 
     RETURNING username`,
    [username, password, name]
  );
  return result.rows[0].username;
};

const deleteOneUser = async (username) => {
  const result = await db.query(`DELETE FROM USERS WHERE USERNAME = $1`, [username]);
  return result.rowCount > 0; // Returns true if at least one row was deleted
};
module.exports = {
  checkUsername,
  createUser,
  deleteOneUser,
};
