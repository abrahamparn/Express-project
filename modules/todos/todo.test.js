const supertest = require("supertest");
const { test, after, describe, beforeEach, before, afterEach } = require("node:test");
const assert = require("node:assert");

const { deleteOneUser, createUser } = require("../authentication/authentication.model");
const { hashPassword } = require("../../utils/password");

const app = require("../../app");
const { json } = require("express");
const api = supertest(app);

describe("TODOS API TESTING", () => {
  afterEach(async () => {
    // Clean up by deleting the user after each test
    await deleteOneUser("testingLogin");
  });
  let login;
  beforeEach(async () => {
    await deleteOneUser("testingLogin");

    // Ensure the test user is deleted before each test
    let hashedPassword = await hashPassword("testingLogin");
    await createUser("testingLogin", hashedPassword, "testingLogin");

    login = await api
      .post("/api/authentication/login")
      .send({
        username: "testingLogin",
        password: "testingLogin",
      })
      .expect("Content-Type", /application\/json/)
      .expect(200);
  });

  describe("GET /api/todos/test/", () => {
    test("Will return success", async () => {
      const response = await api
        .get("/api/todos/test/")
        .set("Authorization", `Bearer ${login.body.token}`) // Set the invalid token in the header
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.success, "Invalid token");
    });
  });

  describe("POST /api/todos/create", () => {
    test("Will return success", async () => {
      const response = await api
        .post("/api/todos/create")
        .set("Authorization", `Bearer ${login.body.token}`) // Set the invalid token in the header
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });
  });
});
