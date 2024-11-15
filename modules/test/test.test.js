const supertest = require("supertest");
const { test, after, describe, beforeEach, before } = require("node:test");
const assert = require("node:assert");

const app = require("../../app");
const api = supertest(app);

describe("Test API testing", () => {
  test("'/api/test/' will return HTML", async () => {
    const response = await api.get("/api/test/").expect(200).expect("Content-Type", /html/);

    // Check that the response contains expected HTML elements
    const html = response.text;
    assert(html.includes("<title>Test API</title>"));
    assert(html.includes("<h1>Successful Test API Call</h1>"));
    assert(html.includes("Purpose: TODOS API"));

    // Note: We don't test for exact date match since it's dynamic,
    // but we can check that a date is included
    assert(html.includes("Today:"));
  });

  test("'api/test/testDatabase' will return JSON and successfull", async () => {
    const description = { description: "Success" };
    const response = await api
      .post("/api/test/testDatabase")
      .send(description)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(response.body, {
      status: "success",
      result: {
        description: "Success",
      },
    });
  });

  test("'api/test/testDatabase' will return JSON and error", async () => {
    const description = { description: "" };

    const response = await api
      .post("/api/test/testDatabase")
      .send(description)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.deepStrictEqual(response.body, {
      error: "Description cannot be empty",
    });
  });
});
