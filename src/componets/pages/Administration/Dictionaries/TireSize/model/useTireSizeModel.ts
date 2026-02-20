import { useMemo } from "react"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import DataSource from "devextreme/data/data_source"
import CustomStore from "devextreme/data/custom_store"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { ITireSize } from "../../../../../../interfaces/ITireSize"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void
}

const signalEmitter= new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_TIRE_SIZE,[
    ]
)

export const useTireSizeModel = (props:IProps) => {

    const dataSource = useMemo(()=>{
        return new DataSource<ITireSize,number>({
            store: new CustomStore<ITireSize,number>({
                key: "idTireSize",
                async load(): Promise<ITireSize[]>{
                    type T = {tireSizes : ITireSize[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query TireSizes {
                            tireSizes {
                                idTireSize
                                size
                                profile
                                diametr
                                width
                                tireModels {
                                    idTireModel
                                }
                            }
                        }
                    `);
                    return values?.tireSizes ?? []; 
                }, 
                async insert(values: ITireSize){
                    console.log(values)
                    type T = { createTireSize: { size: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateTireSize($input: CreateTireSizeInput!) {
                            createTireSize(input: $input) {
                                size
                            }
                        }
                    `, { input: { ...values }})
                    if(created?.createTireSize){
                        props.showToast("success",`Создан новый размер: ${created?.createTireSize.size}`)
                        signalEmitter.emit()
                    } 
                    return values;
                },
                async update(key,values){
                    type T = { updateTireSizeById: { size: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateTireSizeById($ident: Int!, $input: UpdateTireSizeInput!) {
                            updateTireSizeById(ident: $ident, input: $input) {
                                size
                            }
                        }
                    `,{ ident: key, input: { ...values }});
                    if(updated?.updateTireSizeById.size){
                        props.showToast("success",`Размер обновлен ${updated?.updateTireSizeById.size}`)   
                        signalEmitter.emit()
                    }
                },
                async remove(key: number) {
                    type T = { deleteTireSizeById: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation DeleteTireSizeById($ident: Int!) {
                            deleteTireSizeById(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteTireSizeById > 0){
                        props.showToast("success", `Размер удален ${key})`)
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