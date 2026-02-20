import { useMemo } from "react"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import DataSource from "devextreme/data/data_source"
import CustomStore from "devextreme/data/custom_store"
import type { ITireBrand } from "../../../../../../interfaces/ITireBrand"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void
}

const signalEmitter= new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_TIRE_BRAND,[]
)

export const useTireBrandModel = (props:IProps) => {

    const dataSource = useMemo(()=>{
        return new DataSource<ITireBrand,number>({
            store: new CustomStore<ITireBrand,number>({
                key: "idTireBrand",
                async load(): Promise<ITireBrand[]>{
                    type T = {tireBrands : ITireBrand[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query TireBrands {
                            tireBrands {
                                idTireBrand
                                name
                                comment
                                tireModels {
                                    idTireModel
                                }
                            }
                        }
                    `);
                    return values?.tireBrands ?? []; 
                }, 
                async insert(values: ITireBrand){
                    type T = { createTireBrand: { name: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateTireBrand($input: CreateTireBrandInput!) {
                            createTireBrand(input: $input) {
                                name
                            }
                        }
                    `, { input: { ...values }})
                    if(created?.createTireBrand){
                        props.showToast("success",`Создан новый бренд: ${created?.createTireBrand.name}`)
                        signalEmitter.emit()
                    } 
                    return values;
                },
                async update(key,values){
                    type T = { updateTireBrandById: { name: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateTireBrandById($ident: Int!, $input: UpdateTireBrandInput!) {
                            updateTireBrandById(ident: $ident, input: $input) {
                                name
                            }
                        }
                    `,{ ident: key, input: { ...values }});
                    if(updated?.updateTireBrandById.name){
                        props.showToast("success",`Бренд обновлен ${updated?.updateTireBrandById.name}`)   
                        signalEmitter.emit()
                    }
                },
                async remove(key: number) {
                    type T = { deleteTireBrandById: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation DeleteTireBrandById($ident: Int!) {
                            deleteTireBrandById(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteTireBrandById > 0){
                        props.showToast("success", `Бренд удален (ID: ${key})`)
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