import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { mockLink } from "./fixtures";

import { TodoRepository, TodoController, TodoPresenter } from ".";

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
