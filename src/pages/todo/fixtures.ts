import { MockLink, MockedResponse } from "@apollo/client/testing";

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

export const mockLink = new MockLink([createTodoMock, getAllTodosStub]);
