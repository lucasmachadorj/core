import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  ApolloClientBuilder,
  CreateTodoMockBuilder,
  GetAllTodosMockBuilder,
} from "./fixtures";

import { TodoRepository, TodoController, TodoPresenter } from ".";

describe("TodoController", () => {
  describe("Create Todo", () => {
    let todoText: string;
    let todoRepository: TodoRepository;
    let todoPresenter: TodoPresenter;
    let client: ApolloClient<NormalizedCacheObject>;

    beforeEach(() => {
      todoText = "let's do something";
    });

    afterEach(() => {
      if (todoPresenter) todoPresenter.unsubscribe();
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
  });
});
