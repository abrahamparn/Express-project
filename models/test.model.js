const db = require("../utils/db");

const insertTest = async (test) => {
  console.log("insertTest", test);
  const result = await db.query(
    `INSERT INTO TEST_TABLE (description) VALUES ($1) RETURNING description`,
    [test]
  );
  return result.rows[0];
};

module.exports = {
  insertTest,
};
