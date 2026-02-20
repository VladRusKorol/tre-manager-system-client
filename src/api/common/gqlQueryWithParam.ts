import type { ApolloClient } from "@apollo/client";
import type { DocumentNode } from "graphql";
import { client } from "../../App";

export async function gqlQueryWithParam<T>(query: DocumentNode, variables: any){
    try {
        let requestResult: ApolloClient.QueryResult<T> = await client.query<T>({query, variables});
        if(requestResult.error) throw new Error('Ошибка передачи данных query запроса'); 
        return requestResult.data
    } catch (error) {
        console.log(error)
    }
}