import CustomStore from "devextreme/data/custom_store"
import DataSource from "devextreme/data/data_source"
import { useEffect, useMemo } from "react"
import type { ITire } from "../../../../../../interfaces/ITire"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"
import type { DataGrid } from "devextreme-react"


interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<ITire, number> | null>
}

const signalEmmiter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_TIRE_MODEL,[
        SIGNAL_EMMITER_CONST.REFRESH_TIRE_MODEL
    ]
)

export const useTireModel = (props: IProps) => {
    
    
    const dataSource = useMemo(()=> {
        return new DataSource<ITire, number>({
            store: new CustomStore<ITire, number>({
                key: "idTire",
                async load():  Promise<ITire[]>{
                    type T = { tires: ITire[] } | undefined
                    const request: T = await apiClient.query<T>(gql`
                        query Tires {
                            tires {
                                idTire
                                serialNumber
                                isActive
                                idTireModel
                                entrySystemMiliage
                                entrySystemData
                                disposalDate
                                currentMiliage
                            }
                        }
                    `);
                    return request?.tires ?? [];
                },
                
                async insert(values: ITire){
                    type T = { createTire: { serialNumber: string }} | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation CreateTire($createTireInput: CreateTireInput!) {
                            createTire(createTireInput: $createTireInput) {
                                serialNumber
                            }
                        }   
                    `,{createTireInput: { ... values, currentMiliage: values.entrySystemMiliage }});
                    if(request?.createTire.serialNumber){
                        props.showToast("success", `Создана новая шина ${request?.createTire.serialNumber}`);
                        signalEmmiter.emit();
                    } 
                    return values
                },

                async update (key, values){
                    type T = { updateTire: { serialNumber: string }} | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation UpdateTire($updateTireInput: UpdateTireInput!, $ident: Int!) {
                            updateTire(updateTireInput: $updateTireInput, ident: $ident) {
                                serialNumber
                            }
                        }
                    `,{ident: key, updateTireInput: { serialNumber: values.serialNumber, idTireModel: values.idTireModel,  entrySystemData: values.entrySystemData}});
                    if(request?.updateTire.serialNumber){
                        props.showToast("success",`Шина обновлена ${request?.updateTire.serialNumber}`)
                        signalEmmiter.emit();
                    } 
                },

                async byKey(key: number ): Promise<ITire> {
                    type T = { tireById: ITire } | undefined
                    const request: T = await apiClient.queryWithVars<T>(gql`
                        query TireById($ident: Int!) {
                            tireById(ident: $ident) {
                                idTire
                                serialNumber
                                isActive
                                idTireModel
                                entrySystemMiliage
                                entrySystemData
                                disposalDate
                                currentMiliage
                            }
                        }
                    `,{ident: key});
                    if(request?.tireById){
                        return request.tireById;
                    } 
                    props.showToast("error", `Ошибка при поиске шины с ID: ${key}`);
                    throw new Error(`Location ${key} not found`);
                },
            })
        })
    },[])

    const tireModelLookup = useMemo(()=>{
        return new CustomStore<{idTireModel: number, name: string}>({
            key:"idTireModel",
            load: async () => {
                const request: 
                    { tireModels: { idTireModel: number, name: string,  tireBrand: { name: string }}[] } | undefined 
                    = await apiClient.query<{ tireModels: { idTireModel: number, name: string,  tireBrand: { name: string }}[] }>(gql`
                    query TireModels {
                        tireModels {
                            idTireModel
                            name
                            tireBrand {
                                name
                            }
                        }
                    }
                `);
                
                return request?.tireModels.map( value => {
                    return {
                        idTireModel: value.idTireModel,
                        name: value.tireBrand.name + " " + value.name
                    }
                }) ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])



    useEffect(() => {
        
            const handleRefresh = () => {
    
                tireModelLookup.clearRawDataCache();
                tireModelLookup.load();
    
                dataSource.load(); 
                props.dgRef.current?.instance.refresh();
            };
    
            signalEmmiter.on(handleRefresh);
    
            return () => signalEmmiter.off(handleRefresh)
        }, [dataSource]);
    
    



    return {
        dataSource,
        tireModelLookup
    }
}