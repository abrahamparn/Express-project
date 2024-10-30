const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");

//Import routers
const testRouter = require("./controllers/test.controller");
const authRouter = require("./controllers/authentication.controller");

const app = express();
logger.info("connecting to ", config.POSTGRES_URI);

app.use(helmet());
app.use(cors());
app.use(express.json());
// Add logger middleware
app.use(middleware.morganLogger);
app.use(middleware.requestLogger);

// authentication route
app.use("/api/authentication", authRouter);
// Only for testing environment
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
  app.use("/api/test", testRouter);
}

app.use(middleware.unknownEndpoint);

module.exports = app;
