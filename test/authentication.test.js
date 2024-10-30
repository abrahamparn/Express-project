const supertest = require("supertest");
const { test, after, describe, beforeEach, before, afterEach } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const api = supertest(app);

// supporting functions
const { deleteOneUser, createUser } = require("../models/user.model");
const { hashPassword } = require("../utils/password");

describe("test for authentication", () => {
  describe("registration test", () => {
    beforeEach(async () => {
      await deleteOneUser("testingUser");
    });

    afterEach(async () => {
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

  describe("login test", () => {
    afterEach(async () => {
      // Clean up by deleting the user after each test
      await deleteOneUser("testingLogin");
    });
    beforeEach(async () => {
      await deleteOneUser("testingLogin");

      // Ensure the test user is deleted before each test
      let hashedPassword = await hashPassword("testingLogin");
      await createUser("testingLogin", hashedPassword, "testingLogin");
    });
    test("empty username or password will return error", async () => {
      const response = await api
        .post("/api/authentication/login")
        .send({})
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.error, "username and password are required");
    });

    test("username does not exists", async () => {
      const response = await api
        .post("/api/authentication/login")
        .send({
          username: "hohoho",
          password: "testingUser",
        })
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.error, "Invalid username or password");
    });

    test("invalid password", async () => {
      const response = await api
        .post("/api/authentication/login")
        .send({
          username: "testingLogin",
          password: "nonono",
        })
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.error, "Invalid username or password");
    });

    test("Able to login", async () => {
      const response = await api
        .post("/api/authentication/login")
        .send({
          username: "testingLogin",
          password: "testingLogin",
        })
        .expect("Content-Type", /application\/json/)
        .expect(200);

      assert.ok(response.body.token);
      assert.strictEqual(response.body.username, "testingLogin");
    });
  });
});
