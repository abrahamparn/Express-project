const supertest = require("supertest");
const { test, after, describe, beforeEach, before } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const api = supertest(app);

// supporting functions
const { deleteOneUser } = require("../models/user.model");

describe("test for authentication", () => {
  describe("registration test", () => {
    beforeEach(async () => {
      // Ensure the test user is deleted before each test
      await deleteOneUser("testingUser");
    });

    test("missing parameters", async () => {
      const response = await api
        .post("/api/authentication/register/")
        .send({})
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.error, "username,  password, and name are required");
    });

    test("password character is less than required", async () => {
      const response = await api
        .post("/api/authentication/register/")
        .send({
          name: "abraham naiborhu",
          password: "10",
          username: "abraham",
        })
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.equal(response.body.error, "password must be more than 5 characters long");
    });

    test("username character is less than required", async () => {
      const response = await api
        .post("/api/authentication/register/")
        .send({
          name: "abraham naiborhu",
          password: "10",
          username: "ab",
        })
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.equal(response.body.error, "username must be more than 5 characters long");
    });

    test("existing username", async () => {
      const response = await api
        .post("/api/authentication/register")
        .send({
          name: "abraham naiborhu",
          password: "100000",
          username: "abraham",
        })
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.equal(response.body.error, "username already exists, please choose another one.");
    });

    test("create new user", async () => {
      const response = await api
        .post("/api/authentication/register")
        .send({
          name: "testingUser",
          password: "testingUser",
          username: "testingUser",
        })
        .set("Accept", "application/json")
        .expect("Content-Type", /application\/json/)
        .expect(201); // Expecting 201 Created

      // Optional: Verify the response body
      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.username, "testingUser");
    });
  });
});
