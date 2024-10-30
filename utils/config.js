require("dotenv").config();

const PORT = process.env.PORT || 3001;

const POSTGRES_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_POSTGRES_URI
    : process.env.PRODUCTION_POSTGRES_URI;

module.exports = {
  PORT,
  POSTGRES_URI,
};
