import { useEffect, useMemo } from "react";
import type { TMessageType } from "../../../../../../contexts/ToastContext";
import DataSource from "devextreme/data/data_source";
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType";
import { apiClient } from "../../../../../../api/ApiClient";
import type { IEquipment } from "../../../../../../interfaces/IEquipment";
import { gql } from "@apollo/client";
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter";
import type { DataGrid } from "devextreme-react";
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS";

interface IUseModel {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<IEquipmentType, number> | null>
}

const signalEmmiter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENT_TYPES_DATA,
    [
        //SIGNAL_EMMITER_CONST.REFRESH_WHEEL_SCHEMA_DATA
    ]
)

export const useEquipmentTypeModel = (props: IUseModel) => {
    
    const dataSource = useMemo(()=> {
        return new DataSource<IEquipmentType>({
            key: "idEquipmentType",
            async load(){
                const request = await apiClient.query< { equipmentTypes: IEquipment[] } >(gql`
                    query EquipmentTypes {
                        equipmentTypes {
                            name
                            idEquipmentType
                            equipments {
                                idEquipment
                            }
                        }
                    }
                `); 
                return request?.equipmentTypes ?? []; 
            },
            async insert(values: IEquipmentType){
                const created: { createEquipmentType: { name: string; }; } | undefined = await apiClient.mutation< { createEquipmentType: { name: string} }>(gql`
                    mutation CreateEquipmentType($createInput: CreateEquipmentTypeInput!) {
                        createEquipmentType(createInput: $createInput) {
                            name
                        }
                    }   
                `, {createInput: values}); 
                if(created?.createEquipmentType.name) {
                    props.showToast("success", `Добавлен новый тип транспорта: ${created.createEquipmentType.name}`)
                    signalEmmiter.emit()
                } else {
                    props.showToast("error", `Ошибка при создании нового типа транспорта`)
                }
                return values
            },
            async update(key, values){
                const updated: { updateEquipmentType: { name: string; }; } | undefined = await apiClient.mutation< { updateEquipmentType: { name: string} }>(gql`
                    mutation UpdateEquipmentType($ident: Int!, $updateInput: UpdateEquipmentTypeInput!) {
                        updateEquipmentType(ident: $ident, updateInput: $updateInput) {
                            name
                        }
                    }
                `, {ident:key, updateInput: values}); 
                if(updated?.updateEquipmentType.name){
                    props.showToast("success", `Транспорт успешно обновлен: ${updated?.updateEquipmentType.name}`)
                    signalEmmiter.emit()
                } else {
                    props.showToast("error", `Ошибка при обновлении типа транспорта`)
                }
            },
            async remove(key: number) {
                const deleted: { deleteEquipmentType: number } | undefined = await apiClient.mutation<{ deleteEquipmentType: number }>(gql`
                    mutation DeleteEquipmentType($ident: ID!) {
                        deleteEquipmentType(ident: $ident)
                    }
                `, { ident: key });
                if (deleted && deleted.deleteEquipmentType > 0) {
                    props.showToast("success", `Тип транспорта успешно удален (ID: ${key})`);
                    signalEmmiter.emit()
                } else {
                    props.showToast("error", `Ошибка при удалении типа транспорта`);
                }
            }
        })
    },[])

    /*
    useEffect(() => {

        const handleRefresh = () => {
            dataSource.load(); 
            props.dgRef.current?.instance.refresh();
        };

        signalEmmiter.on(handleRefresh);

        return () => signalEmmiter.off(handleRefresh)
    }, [dataSource]);
    */

    return {
        dataSource
    }
}