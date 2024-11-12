const testModel = require("./test.model");
const logger = require("../../middleware/logger");

const getTestPage = async (req, res, next) => {
  try {
    let today = new Date();
    let body = `
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
    `;
    return res.status(200).send(body);
  } catch (exception) {
    next(exception);
  }
};

const testDatabase = async (req, res, next) => {
  try {
    const { description } = req.body;

    if (!description || description.trim() === "") {
      return res.status(400).json({ error: "Description cannot be empty" });
    }

    const result = await testModel.insertTest(description);

    return res.status(200).json({ status: "success", result });
  } catch (exception) {
    logger.error(exception);
    next(exception);
  }
};

module.exports = {
  getTestPage,
  testDatabase,
};
