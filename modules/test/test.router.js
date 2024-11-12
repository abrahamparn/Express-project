const express = require("express");
const testController = require("./test.controller");

const router = express.Router();

router.get("/", testController.getTestPage);
router.post("/testDatabase", testController.testDatabase);

module.exports = router;
