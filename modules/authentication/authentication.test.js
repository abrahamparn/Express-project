const supertest = require("supertest");
const { test, after, describe, beforeEach, before, afterEach } = require("node:test");
const assert = require("node:assert");
const app = require("../../app");
const api = supertest(app);

// supporting functions
const { deleteOneUser, createUser } = require("./authentication.model");
const { hashPassword } = require("../../utils/password");

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

      assert.ok(response.body.errors, "Errors array is missing");
      assert.strictEqual(Array.isArray(response.body.errors), true, "Errors is not an array");

      const expectedErrors = [
        {
          type: "field",
          msg: "Username must be at least 6 characters",
          path: "username",
          location: "body",
        },
        {
          type: "field",
          msg: "Password must be at least 6 characters",
          path: "password",
          location: "body",
        },
        {
          type: "field",
          msg: "Name is required",
          path: "name",
          location: "body",
        },
      ];

      // Verify each expected error is present in the response
      expectedErrors.forEach((expectedError) => {
        const errorFound = response.body.errors.some((error) =>
          Object.entries(expectedError).every(([key, value]) => error[key] === value)
        );
        assert.ok(errorFound, `Expected error not found: ${JSON.stringify(expectedError)}`);
      });
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

      assert.ok(response.body.errors, "Errors array is missing");
      assert.strictEqual(Array.isArray(response.body.errors), true, "Errors is not an array");

      const expectedError = [
        {
          type: "field",
          value: "10",
          msg: "Password must be at least 6 characters",
          path: "password",
          location: "body",
        },
      ];

      expectedError.forEach((expectedError) => {
        const errorFound = response.body.errors.some((error) =>
          Object.entries(expectedError).every(([key, value]) => error[key] === value)
        );
        assert.ok(errorFound, `Expected error not found: ${JSON.stringify(expectedError)}`);
      });
    });

    test("username character is less than required", async () => {
      const response = await api
        .post("/api/authentication/register/")
        .send({
          name: "abraham naiborhu",
          password: "1010101010",
          username: "ab",
        })
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.ok(response.body.errors, "Errors array is missing");
      assert.strictEqual(Array.isArray(response.body.errors), true, "Errors is not an array");

      const expectedError = [
        {
          type: "field",
          value: "ab",
          msg: "Username must be at least 6 characters",
          path: "username",
          location: "body",
        },
      ];

      expectedError.forEach((expectedError) => {
        const errorFound = response.body.errors.some((error) =>
          Object.entries(expectedError).every(([key, value]) => error[key] === value)
        );
        assert.ok(errorFound, `Expected error not found: ${JSON.stringify(expectedError)}`);
      });
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

  describe("Change password test", () => {
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

    test("Unauthorized because there is no bearer token", async () => {
      const response = await api
        .post("/api/authentication/change-password")
        .send({})
        .expect("Content-Type", /application\/json/)
        .expect(401);

      assert.strictEqual(response.body.error, "Unauthorized");
    });

    test("should respond with 401 Unauthorized when token is invalid", async () => {
      const invalidToken = "LALA LAND";
      const response = await api
        .post("/api/authentication/change-password")
        .set("Authorization", `Bearer ${invalidToken}`) // Set the invalid token in the header
        .send({
          username: "testingLogin",
          password: "testingLogin",
          newPassword: "testingLogin2",
        })
        .expect("Content-Type", /application\/json/) // Expect JSON response
        .expect(401); // Expect HTTP status 401

      // Assert that the error message is as expected
      assert.strictEqual(response.body.error, "Invalid token");
    });

    test("Should response with error when password is missing", async () => {
      const login = await api
        .post("/api/authentication/login")
        .send({
          username: "testingLogin",
          password: "testingLogin",
        })
        .expect("Content-Type", /application\/json/)
        .expect(200);

      const response = await api
        .post("/api/authentication/change-password")
        .set("Authorization", `Bearer ${login.body.token}`) // Set the invalid token in the header
        .send({
          username: "testingLogin",
          password: "",
          newPassword: "asdfasdfasd",
        })
        .expect("Content-Type", /application\/json/) // Expect JSON response
        .expect(400); // Expect HTTP status 401

      // Assert that the error message is as expected
      assert.strictEqual(
        response.body.error,
        "username, password, and newPassword cannot be empty"
      );
    });

    test("Should response with 400 when username is wrong", async () => {
      const login = await api
        .post("/api/authentication/login")
        .send({
          username: "testingLogin",
          password: "testingLogin",
        })
        .expect("Content-Type", /application\/json/)
        .expect(200);

      const response = await api
        .post("/api/authentication/change-password")
        .set("Authorization", `Bearer ${login.body.token}`) // Set the invalid token in the header
        .send({
          username: "wrong",
          password: "testingLogin",
          newPassword: "testingLogin",
        })
        .expect("Content-Type", /application\/json/) // Expect JSON response
        .expect(403); // Expect HTTP status 401

      // Assert that the error message is as expected
      assert.strictEqual(response.body.error, "You can only change your own password");
    });
  });
});
