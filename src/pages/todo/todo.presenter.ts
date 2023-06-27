import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from "@apollo/client";
import { Todo, Todos } from "./todo.viewmodel";
import { GET_ALL_TODOS } from "./api";
import { Subscription } from "zen-observable-ts";

type TodoPresenterState = {
  todos: Todos;
};

export class TodoPresenter {
  private state: TodoPresenterState;
  private subscriptions: Record<string, Subscription> = {};

  constructor(private client: ApolloClient<NormalizedCacheObject>) {
    this.state = {
      todos: new Todos([]),
    };
    this.todosSubscription = this.watchedQuery().subscribe({
      next: this.handleStateChange.bind(this),
      error: (err) => console.error(err),
    });
  }

  async getAllTodos(): Promise<Todo[]> {
    return this.todos.getAll();
  }

  private watchedQuery(): ObservableQuery {
    return this.client.watchQuery({
      query: GET_ALL_TODOS,
      fetchPolicy: "cache-and-network",
    });
  }

  private handleStateChange({ data }: any) {
    this.todos.reset();

    if (!data || !data.todos) {
      return;
    }
    const { todos } = data;
    todos.map((todo: any) => {
      this.todos.add(
        new Todo({
          id: todo.id,
          text: todo.text,
          completed: todo.completed,
        })
      );
    });
  }

  private get todos(): Todos {
    return this.state.todos;
  }

  private get todosSubscription(): Subscription {
    return this.subscriptions.todos;
  }

  private set todosSubscription(subscription: Subscription) {
    this.subscriptions.todos = subscription;
  }
}
