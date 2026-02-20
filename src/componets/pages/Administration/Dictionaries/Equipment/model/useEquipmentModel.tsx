
import DataSource from "devextreme/data/data_source";
import { useEffect, useMemo } from "react";
import type { IEquipment } from "../../../../../../interfaces/IEquipment";
import { apiClient } from "../../../../../../api/ApiClient";
import { gql } from "@apollo/client";
import CustomStore from "devextreme/data/custom_store";
import type { TMessageType } from "../../../../../../contexts/ToastContext";
import type { DataGrid } from "devextreme-react";
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter";
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS";

interface IUseEquipmentModel {
    showToast: (messageType: TMessageType, message: string) => void,    
    dgRef: React.RefObject<DataGrid<IEquipment, number> | null>
}

const signalEmmiter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENTS_DATA,
    [
        SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENT_TYPES_DATA,
        SIGNAL_EMMITER_CONST.REFRESH_LOCATION_DATA,
        SIGNAL_EMMITER_CONST.REFRESH_LOCATION_DATA,
        SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENT_MODELS_DATA
    ]
);


export const useEquipmentModel = (props: IUseEquipmentModel) => {



    const dataSource = useMemo(()=> {

        return new DataSource<IEquipment>({
            //---------------------------------------------------------------------------------------
            key: "idEquipment",
            //---------------------------------------------------------------------------------------
            async load() {
                type T = { equipments: IEquipment[] } | undefined;
                const request = await apiClient.query<T>(gql`
                    query Equipments {
                        equipments {
                            idEquipment name idEquipmentType idEquipmentModel 
                            locations {
                                idLocation
                            }
                        }
                    }
                `); 
                return request?.equipments ?? []; 
            },
            //---------------------------------------------------------------------------------------
            async insert(values: IEquipment){
                type T =  { createEquipment: { name: string; }; } | undefined;
                const created: T = await apiClient.mutation<T>(gql`
                    mutation CreateEquipment($createInput: CreateEquipmentInput!) {
                        createEquipment(createInput: $createInput) {
                            name
                        }
                    }
                `, {createInput: values}); 

                if(created?.createEquipment.name) {
                    props.showToast("success", `Добавлен новый транспорт: ${created.createEquipment.name}`)
                    signalEmmiter.emit();
                } else {
                    props.showToast("error", `Ошибка при создании нового транспорта`)
                }
                return values
            },
            //---------------------------------------------------------------------------------------
            async update(key, values){
                type T = { updateEquipment: { name: string; }; } | undefined; 
                const updated: T = await apiClient.mutation<T>(gql`
                    mutation UpdateEquipment($ident: Int!, $updateInput: UpdateEquipmentInput!) {
                        updateEquipment(ident: $ident, updateInput: $updateInput) {
                            name
                        }
                    }
                `, {ident:key, updateInput: values}); 
                if(updated?.updateEquipment.name){
                    props.showToast("success", `Транспорт успешно обновлен: ${updated?.updateEquipment.name}`)
                    signalEmmiter.emit();
                } else {
                    props.showToast("error", `Ошибка при обновлении транспорта`)
                }
            },
            //---------------------------------------------------------------------------------------
            async remove(key: number) {
                type T = { deleteEquipment: number } | undefined
                const deleted:T = await apiClient.mutation<T>(gql`
                    mutation DeleteEquipment($ident: Int!) {
                        deleteEquipment(ident: $ident)
                    }
                `, { ident: key });
                if (deleted && deleted.deleteEquipment > 0) {
                    props.showToast("success", `Транспорт успешно удален (ID: ${key})`);
                    signalEmmiter.emit();
                } else {
                    props.showToast("error", `Ошибка при удалении транспорта`);
                }
            }
            //---------------------------------------------------------------------------------------
        })
    },[])

    const EquipmentTypesLoockUp = useMemo(()=> {
        return new CustomStore<{idEquipmentType: number,  name: string}>({
            key: "idEquipmentType",
            load: async () => {
                type T = { equipmentTypes: {idEquipmentType: number,  name: string}[] } | undefined;
                const request: T = await apiClient.query<T>(gql`
                    query EquipmentTypes {
                        equipmentTypes {
                            idEquipmentType
                            name
                        }
                    }
                `)
                return request?.equipmentTypes ?? []; 
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const EquipmentModelsLoockUp = useMemo(()=> {
        return new CustomStore<{idEquipmentModel: number,  name: string}>({
            key: "idEquipmentModel",
            load: async () => {
                type T = { equipmentModels: {idEquipmentModel: number,  name: string}[] } | undefined;
                const request: T = await apiClient.query<T>(gql`
                    query EquipmentModels {
                        equipmentModels {
                            idEquipmentModel
                            name
                        }
                    }
                `)
                return request?.equipmentModels ?? []; 
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    useEffect(() => {

        const handleRefresh = () => {
            EquipmentTypesLoockUp.clearRawDataCache();
            EquipmentTypesLoockUp.load()
            EquipmentModelsLoockUp.clearRawDataCache();
            EquipmentModelsLoockUp.load()
            dataSource.load(); 
            props.dgRef.current?.instance.refresh();
        };

        signalEmmiter.on(handleRefresh);

        return () => signalEmmiter.off(handleRefresh)
    }, [dataSource]);
 
    return {
        dataSource,
        EquipmentTypesLoockUp,
        EquipmentModelsLoockUp
    }
}