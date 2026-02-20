import DataSource from "devextreme/data/data_source"
import { useEffect, useMemo } from "react"
import type { IEquipmentModel } from "../../../../../../interfaces/IEquipmentModel"
import CustomStore from "devextreme/data/custom_store";
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import type { DataGrid } from "devextreme-react";
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter";
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS";

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<IEquipmentModel, number> | null>
}

const signalEmmiter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENT_MODELS_DATA, [
        SIGNAL_EMMITER_CONST.REFRESH_WHEEL_SCHEMA_DATA
    ]
)

export const useEquipmentModelData = (props: IProps) => {

    const dataSource = useMemo(()=>{

        return new DataSource<IEquipmentModel, number>({

            store: new CustomStore<IEquipmentModel, number>({

                key: "idEquipmentModel",

                async load(): Promise<IEquipmentModel[]> {
                    type T = { equipmentModels: IEquipmentModel[] } | undefined
                    const returnValues: T = await apiClient.query<T>(gql`
                        query EquipmentModels {
                            equipmentModels {
                                idEquipmentModel
                                name
                                idWheelSchema
                                equipments {
                                    idEquipmentType
                                }
                                wheelSchema {
                                    name
                                }
                            }
                        }
                    `);
                    return returnValues?.equipmentModels ?? [];
                },

                async insert(values: IEquipmentModel){
                    type T = {createEquipmentModel : { name: number }} | undefined
                    const created: T = await apiClient.mutation<T>(gql`
                    mutation CreateEquipmentModel($createInput: CreateEquipmentModelInput!) {
                        createEquipmentModel(createInput: $createInput) {
                            name
                        }
                    }                        
                    `,{createInput: { idWheelSchema: values.idWheelSchema, name: values.name }});
                    if(created?.createEquipmentModel.name){
                        props.showToast("success", `Создана новая модель ${created?.createEquipmentModel.name}`);
                        signalEmmiter.emit();
                    } 
                    return values
                },

                async update(key,values) {
                    type T = { updateEquipmentModel: { name: string } } | undefined
                    const updated: T= await apiClient.mutation<T>(gql`
                        mutation UpdateEquipmentModel($ident: Int!, $updateInput: UpdateEquipmentModelInput!) {
                            updateEquipmentModel(ident: $ident, updateInput: $updateInput) {
                                name
                            }
                        }                       
                    `,{ident: key, updateInput: {...values} })
                    if(updated?.updateEquipmentModel.name){
                        props.showToast("success",`Модель успешно обновлена ${updated?.updateEquipmentModel.name}`)
                        signalEmmiter.emit();
                    } 
                },

                async remove(key){
                    type T = { deleteEquipmentModel: number } | undefined
                    const deleted: T= await apiClient.mutation<T>(gql`
                        mutation DeleteEquipmentModel($ident: Int!) {
                            deleteEquipmentModel(ident: $ident)
                        };
                    `,{ident: key});
                    if(deleted?.deleteEquipmentModel){
                        props.showToast("success", `Модель транспорта успешно удалена (ID: ${key})`)
                        signalEmmiter.emit();
                    } 
                }
            })
        })
    },[])

    const wheelSchemaLookUp = useMemo(()=>{
        return new CustomStore<{idWheelSchema: number, name: string}>({
            key: "IdWheelSchema", 
            load: async () => {
                const request = await apiClient.query<{ wheelSchemas: {IdWheelSchema: number, name: string}[] }>(gql`
                    query WheelSchemas {
                        wheelSchemas {
                            idWheelSchema
                            name
                        }
                    }                   
                `);
                return request?.wheelSchemas ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    useEffect(() => {

        const handleRefresh = () => {
            wheelSchemaLookUp.clearRawDataCache();
            wheelSchemaLookUp.load();
            dataSource.load(); 
            props.dgRef.current?.instance.refresh();
        };

        signalEmmiter.on(handleRefresh);

        return () => signalEmmiter.off(handleRefresh)
    }, [dataSource]);

    return {
        dataSource,
        wheelSchemaLookUp
    }

}