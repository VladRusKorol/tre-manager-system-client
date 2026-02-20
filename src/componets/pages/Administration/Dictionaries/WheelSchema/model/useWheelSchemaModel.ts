import CustomStore, { type Options } from "devextreme/data/custom_store"
import DataSource from "devextreme/data/data_source"
import { useEffect, useMemo, useState } from "react"
import type { IWheelSchema } from "../../../../../../interfaces/IWheelSchema"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"
import type { DataGrid } from "devextreme-react"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<IWheelSchema, number> | null>
}

const signalEmmiterMater = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_WHEEL_SCHEMA_DATA,
    [
        SIGNAL_EMMITER_CONST.REFRESH_WHEEL_SCHEMA_POSITION_DATA,
        SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENT_MODELS_DATA
   ]
)

const signalEmmiterDetail = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_WHEEL_SCHEMA_POSITION_DATA,
    [
        SIGNAL_EMMITER_CONST.REFRESH_WHEEL_SCHEMA_DATA
    ]
)

export const useWheelSchemaModel = (props:IProps) => {

    const [selectedRowKey, setSelectedRowKey] = useState<number>(0)

    const masterDataSource = useMemo(()=>{

        return new DataSource<IWheelSchema, number>({
            store: new CustomStore<IWheelSchema, number>({

                key: "idWheelSchema",

                async load(): Promise<IWheelSchema[]>{
                    type T = {wheelSchemas : IWheelSchema[] } | undefined
                    const values: T = await apiClient.query<T>(gql`
                        query WheelSchemas {
                            wheelSchemas {
                                idWheelSchema
                                name
                                equipmentModels {
                                    idEquipmentModel
                                }
                                wheelSchemaPosition {
                                    idWheelSchemaPosition
                                }
                            }
                        }
                    `);
                    return values?.wheelSchemas ?? []; 
                },

                async insert(values: IWheelSchema){
                    type T = { createWheelSchema: { name: string } } | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                        mutation CreateWheelSchema($createInput: CreateWheelSchemaInput!) {
                            createWheelSchema(createInput: $createInput) {
                                name
                            }
                        }
                    `, { createInput: { name: values.name }})
                    if(created?.createWheelSchema){
                        props.showToast("success",`Создана новая схема ${created?.createWheelSchema.name}`)
                        signalEmmiterMater.emit()
                    } 
                    return values;
                },

                async update(key,values){
                    type T = { updateWheelSchema: { name: string } } | undefined
                    const updated: T = await apiClient.mutation(gql`
                        mutation UpdateWheelSchema($ident: Int!, $updateInput: UpdateWheelSchemaInput!) {
                            updateWheelSchema(ident: $ident, updateInput: $updateInput) {
                                name
                            }
                        }
                    `,{ ident: key, updateInput: { name: values.name }});
                    if(updated?.updateWheelSchema.name){
                        props.showToast("success",`Cхема успешно обновлена ${updated?.updateWheelSchema.name}`)   
                        signalEmmiterMater.emit()
                    }
                },

                async remove(key: number) {
                    type T = { deleteWheelSchema: number } | undefined 
                    const deleted: T = await apiClient.mutation<T>(gql`
                        mutation DeleteWheelSchema($ident: ID!) {
                            deleteWheelSchema(ident: $ident)
                        }
                    `, { ident: key });
                    if (deleted && deleted.deleteWheelSchema > 0){
                        props.showToast("success", `Тип транспорта успешно удален (ID: ${key})`)
                        signalEmmiterMater.emit()
                    }  
                }
            })
        })
    },[]) 

    const detailDataSource = useMemo(()=> {
        return new DataSource<{ idWheelSchemaPosition: number; idWheelSchema: number; idTirePosition: number},number>({
            store: new CustomStore<{ idWheelSchemaPosition: number; idWheelSchema: number; idTirePosition: number},number>({
                key: "idWheelSchemaPosition",
                async load(){
                    if(selectedRowKey !== 0){
                        type T = { wheelSchemaPositionsByWheelSchemaId : { idWheelSchemaPosition: number; idWheelSchema: number; idTirePosition: number}[] } | undefined
                        const request: T = await apiClient.queryWithVars<T>(gql`
                            query WheelSchemaPositionsByWheelSchemaId($ident: Int!) {
                                wheelSchemaPositionsByWheelSchemaId(ident: $ident) {
                                    idWheelSchemaPosition
                                    idWheelSchema
                                    idTirePosition
                                }
                            }
                        `,{ident: selectedRowKey});
                        return request?.wheelSchemaPositionsByWheelSchemaId ?? []
                    } else {
                        return []
                    }
                },

                async insert(values) {
                    if(selectedRowKey !== 0){
                        type T = { createWheelSchemaPosition: { idWheelSchemaPosition: number }} | undefined
                        const inserted: T = await apiClient.mutation<T>(gql`
                            mutation CreateWheelSchemaPosition($createInput: CreateWheelSchemaPositionInput!) {
                                createWheelSchemaPosition(createInput: $createInput) {
                                    idWheelSchemaPosition
                                }
                            }
                        `,{createInput: { idWheelSchema: selectedRowKey, idTirePosition: values.idTirePosition}})
                        if(inserted?.createWheelSchemaPosition){
                            props.showToast("success", "Привязали позицию".toUpperCase())
                            signalEmmiterDetail.emit()
                        } 
                    }
                    
                    return values
                },

                async remove(key) {
                    type T = number | undefined 
                    const request: T =  await apiClient.mutation<T>(gql`
                        mutation DeleteWheelSchemaPosition($ident: Int!) {
                            deleteWheelSchemaPosition(ident: $ident)
                        }
                    `,{ident: key})
                    if(request){
                        props.showToast("success", "отвязали позицию".toUpperCase())
                        signalEmmiterDetail.emit()
                    } 
                },

            })
        })
    },[selectedRowKey])

    const tirePositionLoockUp = useMemo(()=>{
        return new CustomStore<{ idTirePosition: number, name: string}>({
            key: "idTirePosition",
            load: async () => {
                type T = { tirePositions : { idTirePosition: number, name: string}[] } | undefined
                const request: T = await apiClient.query<T>(gql`
                    query TirePositions {
                        tirePositions {
                            idTirePosition
                            name
                        }
                    }
                `);
                return request?.tirePositions ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
        
    },[])


    useEffect(()=>{
        const handleRefresh = () => {

            detailDataSource.load(); 
            masterDataSource.load();
            tirePositionLoockUp.clearRawDataCache();
            tirePositionLoockUp.load();
            props.dgRef.current?.instance.refresh();
        };
        signalEmmiterMater.on(handleRefresh);
        signalEmmiterDetail.on(handleRefresh);
        return () =>{
            signalEmmiterMater.off(handleRefresh);
            signalEmmiterDetail.off(handleRefresh);
        } 
    },[detailDataSource, masterDataSource])

    return {
        masterDataSource,
        detailDataSource,
        tirePositionLoockUp,
        selectedRowKey,
        setSelectedRowKey
    }

}