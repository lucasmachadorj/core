import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  ApolloClientBuilder,
  CreateTodoMockBuilder,
  GetAllTodosMockBuilder,
} from "../fixtures";

import {
  TodoRepository,
  TodoController,
  TodoPresenter,
} from "../../../src/modules/todos/";

describe("TodoController", () => {
  describe("Create Todo", () => {
    let todoText: string;
    let todoRepository: TodoRepository;
    let todoPresenter: TodoPresenter;
    let client: ApolloClient<NormalizedCacheObject>;

    beforeEach(() => {
      todoText = "let's do something";
    });

    test("creating a new todo when none exists", async () => {
      const createTodoMock = new CreateTodoMockBuilder()
        .withVariables({
          text: todoText,
        })
        .withResponse({
          id: "1",
          text: todoText,
          completed: false,
        })
        .build();

      const getAllTodosStub = new GetAllTodosMockBuilder()
        .withResponse([
          {
            id: "1",
            text: todoText,
            completed: false,
          },
        ])
        .build();

      client = new ApolloClientBuilder().withMocks([
        createTodoMock,
        getAllTodosStub,
      ]);

      todoRepository = new TodoRepository(client);
      const todoPresenter = new TodoPresenter(client);
      const todoController = new TodoController(todoRepository);

      await todoController.createTodo(todoText);
      let todos = await todoPresenter.getAllTodos();

      expect(todos).toHaveLength(1);
      expect(todos[0].getText()).toEqual(todoText);
      expect(todos[0].getId()).toBeDefined();
      expect(todos[0].getCompleted()).toBeFalsy();
    });

    test("adding one todo to an existing list", async () => {
      const existingTodo = {
        id: "1",
        text: "Existing Todo",
        completed: true,
      };

      const createTodoMock = new CreateTodoMockBuilder()
        .withVariables({
          text: todoText,
        })
        .withResponse({
          id: "2",
          text: todoText,
          completed: false,
        })
        .build();

      const getAllTodosStub = new GetAllTodosMockBuilder()
        .withResponse([
          existingTodo,
          { id: "2", text: todoText, completed: false },
        ])
        .build();

      client = new ApolloClientBuilder().withMocks([
        createTodoMock,
        getAllTodosStub,
      ]);

      todoRepository = new TodoRepository(client);
      todoPresenter = new TodoPresenter(client);
      const todoController = new TodoController(todoRepository);

      await todoController.createTodo(todoText);
      let todos = await todoPresenter.getAllTodos();

      expect(todos).toHaveLength(2);
      expect(todos[0].getText()).toEqual(existingTodo.text);
      expect(todos[0].getId()).toEqual(existingTodo.id);
      expect(todos[0].getCompleted()).toEqual(existingTodo.completed);

      expect(todos[1].getText()).toEqual(todoText);
      expect(todos[1].getId()).toBeDefined();
      expect(todos[1].getCompleted()).toBeFalsy();
    });
  });
});
