import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { MockLink, MockedResponse } from "@apollo/client/testing";

import { TodoRepository, TodoController, TodoPresenter } from ".";
import { CREATE_TODO, GET_ALL_TODOS } from "./api";

const createTodoMock: MockedResponse = {
  request: {
    query: CREATE_TODO,
    variables: {
      text: "let's do something",
    },
  },
  result: {
    data: {
      createTodo: {
        id: "1",
        text: "let's do something",
        completed: false,
      },
    },
  },
};

const getAllTodosStub: MockedResponse = {
  request: {
    query: GET_ALL_TODOS,
  },
  result: {
    data: {
      todos: [
        {
          id: "1",
          text: "let's do something",
          completed: false,
        },
      ],
    },
  },
};

describe("TodoController", () => {
  describe("Create Todo", () => {
    let todoText: string;
    let cache: InMemoryCache;
    let todoRepository: TodoRepository;
    let client: ApolloClient<NormalizedCacheObject>;

    beforeEach(() => {
      todoText = "let's do something";

      cache = new InMemoryCache({
        addTypename: false,
      });

      const mockLink = new MockLink([createTodoMock, getAllTodosStub]);

      client = new ApolloClient({
        cache,
        link: mockLink,
      });

      todoRepository = new TodoRepository(client);
    });

    test("creating a new todo when none exists", async () => {
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
