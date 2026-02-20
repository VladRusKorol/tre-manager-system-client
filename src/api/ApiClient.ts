import type { DocumentNode } from "graphql";
import { gqlQuery } from "./common/gqlQuery";
import type { TGraphQLRequest } from "./common/TGraphQLRequest";
import { gqlMutation } from "./common/gqlMutation";
import { gqlQueryWithParam } from "./common/gqlQueryWithParam";

// Определяем интерфейс для универсального клиента
export interface IBaseApiClient {
  query<T>(query: DocumentNode): TGraphQLRequest<T>;
  queryWithVars<T>(query: DocumentNode, variables: any): TGraphQLRequest<T>;
  mutation<T>(mutation: DocumentNode, variables: any): TGraphQLRequest<T>;
}

export class BaseApiClient implements IBaseApiClient {
  /**
   * Универсальный метод для выполнения любого GraphQL Query
   * @param gqlQueryNode - Сам запрос (результат функции gql)
   * @param variables - Объект с переменными запроса (опционально)
   */
  async query<T>(gqlQueryNode: DocumentNode): TGraphQLRequest<T> {
    return await gqlQuery<T>(gqlQueryNode);
  }
  /**
   * Универсальный метод для выполнения любого GraphQL Query
   * @param gqlMutationNode - Сам запрос (результат функции gql)
   * @param variables - Объект с переменными запроса (опционально)
   */
  async mutation<T>(gqlMutationNode: DocumentNode, variables: any): TGraphQLRequest<T> {
    return await gqlMutation<T>(gqlMutationNode, variables); 
  }

  /**
   * Универсальный метод для выполнения любого GraphQL Query
   * @param gqlMutationNode - Сам запрос (результат функции gql)
   * @param variables - Объект с переменными запроса (опционально)
   */
  async queryWithVars<T>(gqlMutationNode: DocumentNode, variables: any): TGraphQLRequest<T> {
    return await gqlQueryWithParam<T>(gqlMutationNode, variables); 
  }

}

export const apiClient = new BaseApiClient();