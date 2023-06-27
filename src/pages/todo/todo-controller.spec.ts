import { GlobalCache, InMemoryGlobalCache } from "../../shared/global-cache";
import { FakeTodosRepository } from "./repositories/fake-todos-repository";
import { CommandRepository } from "./repositories/todos-repository";

describe("TodoController", () => {
  describe("Create Todo", () => {
    let todoText: string;
    let cache: GlobalCache;
    let commandRepository: CommandRepository;

    beforeEach(() => {
      todoText = "let's do something";
      cache = new InMemoryGlobalCache({ todos: [] });
      commandRepository = new FakeCommandRepository(cache);
    });

    test("creating a new todo when none exists", async () => {
      const todoPresenter = new TodoPresenter(cache);
      const controller = new CommandController(todosRepository);

      await todoController.createTodo(todoText);

      let todos = todoPresenter.getAllTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].getText()).toEqual(todoText);
      expect(todos[0].getId()).toBeDefined();
      expect(todos[0].getCompleted()).toBeFalsy();
    });
  });
});
