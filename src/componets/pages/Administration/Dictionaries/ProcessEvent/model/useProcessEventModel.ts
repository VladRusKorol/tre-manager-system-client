import DataSource from "devextreme/data/data_source"
import { useMemo } from "react"
import type { IProcessEvent } from "../../../../../../interfaces/IProcessEvent"
import CustomStore from "devextreme/data/custom_store"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { TMessageType } from "../../../../../../contexts/ToastContext"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void
}

export const useProcessEventModel = (props:IProps) => {
    
    const dataSource = useMemo(()=>{

        return new DataSource<IProcessEvent, number>({
            store: new CustomStore({
                key: "idProcessEvent",
                async load(): Promise<IProcessEvent[]>{
                    type T = {processEvents : IProcessEvent[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query ProcessEvents {
                            processEvents {
                                idProcessEvent
                                processEventName
                                countInTireStatusTrans
                            }
                        }
                    `);
                    return values?.processEvents ?? []; 
                },
                async insert(values: IProcessEvent){
                    type T = { createProcessEvent: { processEventName: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateProcessEvent($createInput: CreateProcessEventInput!) {
                            createProcessEvent(createInput: $createInput) {
                                processEventName
                            }
                        }
                    `, { createInput: { processEventName: values.processEventName }})
                    if(created?.createProcessEvent){
                        props.showToast("success",`Создано учетное событие: ${created?.createProcessEvent.processEventName}`)
                    } 
                    return values;
                },
                async update(key,values){
                    type T = { updateProcessEvent: { processEventName: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateProcessEvent($updateInput: UpdateProcessEventInput!, $ident: Int!) {
                            updateProcessEvent(updateInput: $updateInput, ident: $ident) {
                                processEventName
                            }
                        }
                    `,{ ident: key, updateInput: { processEventName: values.processEventName }});
                    if(updated?.updateProcessEvent.processEventName){
                        props.showToast("success",`Учетное событие успешно обновлено ${updated?.updateProcessEvent.processEventName}`)   
                    }
                },
                async remove(key: number) {
                    type T = { deleteProcessEvent: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation Mutation($ident: Int!) {
                            deleteProcessEvent(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteProcessEvent > 0){
                        props.showToast("success", `Учетное событие удалено (ID: ${key})`)
                    }  
                }
            })
        })

    },[])

    return {
        dataSource
    }

}