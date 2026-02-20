import type { ApolloClient } from "@apollo/client";
import type { DocumentNode } from "graphql";
import { client } from "../../App";

export async function gqlMutation<T>(mutation: DocumentNode, variables: any){
    try {
        let requestResult = await client.mutate<T>({mutation, variables});
        if(requestResult.error || requestResult.data === undefined || requestResult.data === null) throw new Error('Ошибка передачи данных mutation запроса'); 
        return requestResult.data
    } catch (error) {
        console.log(error)
    }
}