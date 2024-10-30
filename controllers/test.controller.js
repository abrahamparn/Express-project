const express = require("express");
const testRouter = express.Router();
const logger = require("../utils/logger");
const testModel = require("../models/test.model");
testRouter.get("/", async (req, res, next) => {
  try {
    let today = new Date();
    return res.status(200).send(`
           <html>
        <head>
          <title>Test API</title>
        </head>
        <body>
          <h1>Successful Test API Call</h1>
          <p>Today: ${today}</p>
          <p>Purpose: TODOS API</p>
        </body>
      </html>
        `);
  } catch (exception) {
    next(exception);
  }
});

testRouter.post("/testDatabase", async (req, res, next) => {
  try {
    console.log(req.body);

    const { description } = req.body;
    if (description.trim() === "" || !description) {
      return res.status(400).json({ error: "Description cannot be empty" });
    }

    const result = await testModel.insertTest(description);

    return res.status(200).json({ status: "success", result });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
});

module.exports = testRouter;
