import { useMemo } from "react"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import DataSource from "devextreme/data/data_source"
import CustomStore from "devextreme/data/custom_store"
import type { ITireCarcasType } from "../../../../../../interfaces/ITireCarcasType"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void
}

const signalEmitter= new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRASH_TIRE_CARCAS_TYPE,[]
)

export const useTireCarcasTypeModel = (props:IProps) => {

    const dataSource = useMemo(()=>{
        return new DataSource<ITireCarcasType,number>({
            store: new CustomStore<ITireCarcasType,number>({
                key: "idTireCarcasType",
                async load(): Promise<ITireCarcasType[]>{
                    type T = {tireCarcasTypes : ITireCarcasType[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query TireCarcasTypes {
                            tireCarcasTypes {
                                idTireCarcasType
                                name
                                tireModels {
                                    idTireModel
                                }
                            }
                        }
                    `);
                    return values?.tireCarcasTypes ?? []; 
                }, 
                async insert(values: ITireCarcasType){
                    type T = { createTireCarcasType: { name: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateTireCarcasType($input: CreateTireCarcasTypeInput!) {
                            createTireCarcasType(input: $input) {
                                name
                            }
                        }
                    `, { input: { name: values.name }})
                    if(created?.createTireCarcasType){
                        props.showToast("success",`Создан новый тип каркаса: ${created?.createTireCarcasType.name}`)
                        signalEmitter.emit()
                    } 
                    return values;
                },
                async update(key,values){
                    type T = { updateTireCarcasTypeById: { name: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateTireCarcasTypeById($ident: Int!, $input: UpdateTireCarcasTypeInput!) {
                            updateTireCarcasTypeById(ident: $ident, input: $input) {
                                name
                            }
                        }
                    `,{ ident: key, input: { name: values.name }});
                    if(updated?.updateTireCarcasTypeById.name){
                        props.showToast("success",`Каркас обновлен ${updated?.updateTireCarcasTypeById.name}`)   
                        signalEmitter.emit()
                    }
                },
                async remove(key: number) {
                    type T = { deleteTireCarcasTypeById: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation DeleteTireCarcasTypeById($ident: Int!) {
                            deleteTireCarcasTypeById(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteTireCarcasTypeById > 0){
                        props.showToast("success", `Каркас удален (ID: ${key})`)
                        signalEmitter.emit()
                    }  
                }                
            })
        })
    },[])

    return {
        dataSource
    }

}