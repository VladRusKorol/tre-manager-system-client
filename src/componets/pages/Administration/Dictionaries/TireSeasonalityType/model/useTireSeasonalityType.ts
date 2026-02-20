import { useMemo } from "react"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import DataSource from "devextreme/data/data_source"
import CustomStore from "devextreme/data/custom_store"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { ITireSeasonalityType } from "../../../../../../interfaces/ITireSeasonalityType"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void
}

const signalEmitter= new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_TIRE_SEASONALITY_TYPE,[]
)

export const useTireSeasonalityTypeModel = (props:IProps) => {

    const dataSource = useMemo(()=>{
        return new DataSource<ITireSeasonalityType,number>({
            store: new CustomStore<ITireSeasonalityType,number>({
                key: "idTireSeasonalityType",
                async load(): Promise<ITireSeasonalityType[]>{
                    type T = { tireSeasonalityTypes : ITireSeasonalityType[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query TireSeasonalityTypes {
                            tireSeasonalityTypes {
                                idTireSeasonalityType
                                name  
                                tireModels {
                                    idTireModel
                                }
                            }
                        }
                    `);
                    return values?.tireSeasonalityTypes ?? []; 
                }, 
                async insert(values: ITireSeasonalityType){
                    type T = { createTireSeasonalityType: { name: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateTireSeasonalityType($input: CreateTireSeasonalityTypeInput!) {
                            createTireSeasonalityType(input: $input) {
                                name
                            }
                        }
                    `, { input: { name: values.name }})
                    if(created?.createTireSeasonalityType){
                        props.showToast("success",`Создан новый тип сезонности: ${created?.createTireSeasonalityType.name}`)
                        signalEmitter.emit()
                    } 
                    return values;
                },
                async update(key,values){
                    type T = { updateTireSeasonalityTypeById: { name: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateTireSeasonalityTypeById($ident: Int!, $input: UpdateTireSeasonalityTypeInput!) {
                            updateTireSeasonalityTypeById(ident: $ident, input: $input) {
                                name
                            }
                        }
                    `,{ ident: key, input: { name: values.name }});
                    if(updated?.updateTireSeasonalityTypeById.name){
                        props.showToast("success",`Сезонность обновлена ${updated?.updateTireSeasonalityTypeById.name}`)   
                        signalEmitter.emit()
                    }
                },
                async remove(key: number) {
                    type T = { deleteTireSeasonalityTypeById: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation DeleteTireSeasonalityTypeById($ident: Int!) {
                            deleteTireSeasonalityTypeById(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteTireSeasonalityTypeById > 0){
                        props.showToast("success", `Сезонность удален (ID: ${key})`)
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