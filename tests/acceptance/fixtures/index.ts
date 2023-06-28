import { MockLink, MockedResponse } from "@apollo/client/testing";

import { CREATE_TODO, GET_ALL_TODOS } from "../../../src/pages/todo/api";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

export class ApolloClientBuilder {
  private cache: InMemoryCache;
  constructor() {
    this.cache = new InMemoryCache({
      addTypename: false,
    });
  }

  withMocks(mocks: MockedResponse[]): ApolloClient<NormalizedCacheObject> {
    return new ApolloClient({
      cache: this.cache,
      link: new MockLink(mocks),
    });
  }
}

export class CreateTodoMockBuilder {
  private variables: any;
  private response: any;
  constructor() {}

  withVariables(variables: any) {
    this.variables = variables;
    return this;
  }

  withResponse(response: any) {
    this.response = response;
    return this;
  }

  build(): MockedResponse {
    return {
      request: {
        query: CREATE_TODO,
        variables: this.variables,
      },
      result: {
        data: {
          createTodo: this.response,
        },
      },
    };
  }
}

export class GetAllTodosMockBuilder {
  private response: any;
  constructor() {}

  withResponse(response: any) {
    this.response = response;
    return this;
  }

  build(): MockedResponse {
    return {
      request: {
        query: GET_ALL_TODOS,
      },
      result: {
        data: {
          todos: this.response,
        },
      },
    };
  }
}
