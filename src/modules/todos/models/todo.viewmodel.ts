export type TodoState = {
  id: string;
  text: string;
  completed: boolean;
};

export class Todo {
  constructor(private state: TodoState) {}

  getId() {
    return this.state.id;
  }

  getText() {
    return this.state.text;
  }

  getCompleted() {
    return this.state.completed;
  }
}

export class Todos {
  constructor(private todos: Todo[]) {}

  getAll() {
    return this.todos;
  }

  add(todo: Todo) {
    this.todos.push(todo);
  }

  reset() {
    this.todos = [];
  }
}
