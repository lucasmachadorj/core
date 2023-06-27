import { ApolloClient, NormalizedCacheObject, gql } from "@apollo/client";
import { CREATE_TODO } from "./api";

export class TodoRepository {
  constructor(private client: ApolloClient<NormalizedCacheObject>) {}

  async create(text: string): Promise<void> {
    await this.client.mutate({
      mutation: CREATE_TODO,
      variables: {
        text,
      },
    });
  }
}
