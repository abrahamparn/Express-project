// modules/test/test.model.js

const db = require("../../utils/db");

const insertTest = async (description) => {
  console.log("insertTest", description);
  const result = await db.query(
    `INSERT INTO test_table (description) VALUES ($1) RETURNING description`,
    [description]
  );
  return result.rows[0];
};

module.exports = {
  insertTest,
};
