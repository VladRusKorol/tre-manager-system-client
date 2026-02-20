import { useMemo } from "react"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import DataSource from "devextreme/data/data_source"
import type { IStatus } from "../../../../../../interfaces/IStatus"
import CustomStore from "devextreme/data/custom_store"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"


interface IProps {
    showToast: (messageType: TMessageType, message: string) => void
}


export const useStatusModel = (props:IProps) => {
    
    const dataSource = useMemo(()=>{
        return new DataSource<IStatus, number>({
            store: new CustomStore({
                key: "idStatus",
                async load(): Promise<IStatus[]>{
                    type T = {statuses : IStatus[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query Statuses {
                            statuses {
                                idStatus
                                status
                                statusColor
                                countInTireStatusTrans
                            }
                        }
                    `);
                    return values?.statuses ?? []; 
                },
                async insert(values: IStatus){
                    type T = { createStatus: { status: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateStatus($createInput: CreateStatusInput!) {
                            createStatus(createInput: $createInput) {
                                status
                            }
                        }
                    `, { createInput: { status: values.status, statusColor: values.statusColor}})
                    if(created?.createStatus){
                        props.showToast("success",`Создан учетный статус: ${created?.createStatus.status}`)
                    } 
                    return values;
                },
                async update(key,values){
                    type T = { updateStatus: { status: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateStatus($ident: Int!, $updateInput: UpdateStatusInput!) {
                            updateStatus(ident: $ident, updateInput: $updateInput) {
                                status
                            }
                        }
                    `,{ ident: key, updateInput: { ... values }});
                    if(updated?.updateStatus.status){
                        props.showToast("success",`Учетный статус успешно обновлен ${updated?.updateStatus.status}`)   
                    }
                },
                async remove(key: number) {
                    type T = { deleteStatus: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation DeleteStatus($ident: Int!) {
                            deleteStatus(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteStatus > 0){
                        props.showToast("success", `Учетное статус удален (ID: ${key})`)
                    }  
                }
            })
        })
    },[]) 

    return {
        dataSource
    }
}