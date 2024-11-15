const { Pool } = require("pg");

const config = require("./config");
const logger = require("../middleware/logger");

const pool = new Pool({
  connectionString: config.POSTGRES_URI,
});

pool.on("connect", () => {
  logger.info("Connected to the PostgreSQL database");
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
