const supertest = require("supertest");
const { test, after, describe, beforeEach, before, afterEach } = require("node:test");
const assert = require("node:assert");

const { deleteOneUser, createUser } = require("../authentication/authentication.model");
const { hashPassword } = require("../../utils/password");

const app = require("../../app");
const api = supertest(app);

describe("TODOS API TESTING", () => {
  let authToken, userId;
  const newTodo = {
    title: "Test Todo",
    description: "This is a test todo",
    due_date: "31/12/2024",
    priority: 1,
  };

  beforeEach(async () => {
    // Clean up before each test
    await deleteOneUser("testingLogin");

    // Ensure the test user is deleted before each test
    let hashedPassword = await hashPassword("testingLogin");
    await createUser("testingLogin", hashedPassword, "testingLogin");

    // Retrieve the user to get the ID
    const user = await require("../users/user.model").selectOneUser("testingLogin");
    userId = user.id;

    // login to get the auth token
    const loginResponse = await api
      .post("/api/authentication/login")
      .send({
        username: "testingLogin",
        password: "testingLogin",
      })
      .expect("Content-Type", /application\/json/)
      .expect(200);

    authToken = loginResponse.body.token;
  });

  describe("GET /api/todos/test/", () => {
    test("Will return success", async () => {
      const response = await api
        .get("/api/todos/test/")
        .set("Authorization", `Bearer ${authToken}`) // Set the invalid token in the header
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.success, "hi");
    });

    test("will return unauthorized becasuse of no authToken", async () => {
      const response = await api
        .get("/api/todos/test/")
        //  .set("Authorization", `Bearer ${"hehehe"}`) // Set the invalid token in the header
        .expect(401)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.error, "Unauthorized");
    });
  });

  /**
   * Helper function to create a todo
   */
  const createTestTodo = async (todoData) => {
    const response = await api
      .post("/api/todos/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send(todoData)
      .expect("Content-Type", /application\/json/)
      .expect(201);

    return response.body.todo;
  };

  describe("POST /api/todos/create", () => {
    test("should create a new todo", async () => {
      const response = await api
        .post("/api/todos/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTodo)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.todo.title, newTodo.title);
      assert.strictEqual(response.body.todo.description, newTodo.description);
      assert.strictEqual(response.body.todo.priority, newTodo.priority);
      assert.strictEqual(response.body.todo.is_completed, false);
      assert.strictEqual(response.body.todo.is_deleted, false);
    });

    test("should not be able to create todo because of date problem", async () => {
      const newTodo = {
        title: "Test Todo",
        description: "This is a test todo",
        due_date: "2024/12/01",
        priority: 1,
      };

      const response = await api
        .post("/api/todos/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTodo)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(
        response.body.errors[0].msg,
        "Due date must be in dd/mm/yyyy format and a valid date"
      );
    });

    test("should not be able to create todo because of empty title", async () => {
      const newTodo = {
        title: "",
        description: "This is a test todo",
        due_date: "31/12/2024",
        priority: 1,
      };

      const response = await api
        .post("/api/todos/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTodo)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.errors[0].msg, "Title is required");
    });

    test("should not be able to create todo because of wrong priority format", async () => {
      const newTodo = {
        title: "wrong priority format",
        description: "This is a test todo",
        due_date: "31/12/2024",
        priority: "wrong format",
      };

      const response = await api
        .post("/api/todos/create")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newTodo)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(
        response.body.errors[0].msg,
        "Priority must be a non-negative integer and less than 10"
      );
    });
  });

  describe("GET /api/todos/", () => {
    test("should retrieve all todos for the user", async () => {
      // Create multiple todos
      const todos = [
        { title: "Todo 1", description: "Desc 1", due_date: "31/12/2024", priority: 1 },
        { title: "Todo 2", description: "Desc 2", due_date: "30/12/2024", priority: 2 },
      ];

      for (const todo of todos) {
        await createTestTodo(todo);
      }
      const response = await api
        .get("/api/todos")
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(200);

      assert.strictEqual(response.body.todos.length, todos.length);
      response.body.todos.forEach((todo, index) => {
        assert.strictEqual(todo.title, todos[index].title);
        assert.strictEqual(todo.description, todos[index].description);
      });
    });

    test("should not be able to retrieve todos because of wrong param", async () => {
      const failure = [
        "Page must be a positive integer",
        "limit must a positive integer and should be more than one",
      ];

      const response = await api
        .get("/api/todos?page=hai&limit=hai")
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.errors.length, 2);
      response.body.errors.forEach((error, index) => {
        assert.strictEqual(error.msg, failure[index]);
      });
    });

    test("should retrieve a specific todo by ID", async () => {
      const createdTodo = await createTestTodo(newTodo);

      const response = await api
        .get(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(200);

      assert.strictEqual(response.body.todo.title, newTodo.title);
      assert.strictEqual(response.body.todo.description, newTodo.description);
    });

    test("should not be able to retrieve a specific todo because of wrong id format", async () => {
      const response = await api
        .get(`/api/todos/ulalala`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.errors[0].msg, "Todo ID must be a positive integer");
    });

    test("should not retrieve a deleted todo", async () => {
      const todoData = {
        title: "Specific Todo",
        description: "Specific Description",
        due_date: "31/10/2024",
        priority: 3,
      };

      const createdTodo = await createTestTodo(todoData);
      // Delete the todo
      await api
        .delete(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Attempt to retrieve the deleted todo
      await api
        .delete(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    test("should soft-delete a todo", async () => {
      const createdTodo = await createTestTodo(newTodo);
      const response = await api
        .delete(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(200);

      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.message, "Todo deleted successfully");
    });

    test("should return an error because of todo already deleted", async () => {
      const createdTodo = await createTestTodo(newTodo);
      await api
        .delete(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(200);

      let response = await api
        .delete(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect("Content-Type", /application\/json/)
        .expect(404);

      assert.strictEqual(response.body.error, "Todo not found or already deleted");
    });
  });

  describe("PUT /api/todos/:id", () => {
    test("should be able to edit todo", async () => {
      const createdTodo = await createTestTodo(newTodo);

      const updatedData = {
        title: "Updated Todo",
        description: "Updated Description",
        is_completed: true,
      };

      const response = await api
        .put(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedData)
        .expect("Content-Type", /application\/json/)
        .expect(200);

      assert.strictEqual(response.body.success, true);
      assert.strictEqual(response.body.todo.title, updatedData.title);
      assert.strictEqual(response.body.todo.description, updatedData.description);
      assert.strictEqual(response.body.todo.is_completed, true);
    });

    test("should not be able to edit becasuse of missing title", async () => {
      const createdTodo = await createTestTodo(newTodo);

      const updatedData = {
        title: "",
        description: "Updated Description",
        is_completed: true,
      };

      const response = await api
        .put(`/api/todos/${createdTodo.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updatedData)
        .expect("Content-Type", /application\/json/)
        .expect(400);

      assert.strictEqual(response.body.errors[0].msg, "Title cannot be empty");
    });
  });

  afterEach(async () => {
    // Clean up by deleting the user after each test
    await deleteOneUser("testingLogin");
  });
});
