import type { DocumentNode } from "graphql";
import { client } from "../../App";
import type { ApolloClient } from "@apollo/client";

export async function gqlQuery<T>(query: DocumentNode){
    try {
        let requestResult: ApolloClient.QueryResult<T> = await client.query<T>({query});
        if(requestResult.error) throw new Error('Ошибка передачи данных query запроса'); 
        return requestResult.data
    } catch (error) {
        console.log(error)
    }
}