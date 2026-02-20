import type { DataGrid } from "devextreme-react";
import type { TMessageType } from "../../../../../../contexts/ToastContext";
import type { ITireStatusTrans } from "../../../../../../interfaces/ITireStatusTrans";
import { useMemo } from "react";
import DataSource from "devextreme/data/data_source";
import { apiClient } from "../../../../../../api/ApiClient";
import { gql } from "@apollo/client";
import CustomStore from "devextreme/data/custom_store";


interface IUseTireStatusTransModel {
    showToast: (messageType: TMessageType, message: string) => void,    
    //dgRef: React.RefObject<DataGrid<ITireStatusTrans, number> | null>
}


export const useTireStatusTransModel = (props: IUseTireStatusTransModel) => {

    const dataSource = useMemo(()=> {

        return new DataSource<{idTire: number, name: string}>({
            store: new CustomStore<{idTire: number, name: string}>({
                //---------------------------------------------------------------------------------------
                key: "idTire",
                //---------------------------------------------------------------------------------------
                async load() {
                    type T = { tires: {
                        idTire: number;
                        serialNumber: string;
                        tireModel: {
                            modelName: string;
                            tireBrand: {
                                brandName: string;
                            };
                        };
                    }[] } | undefined;
                    const request = await apiClient.query<T>(gql`
                        query Tires {
                            tires {
                                idTire
                                serialNumber
                                tireModel {
                                    modelName: name
                                    tireBrand {
                                        brandName: name
                                    }
                                }
                            }
                        }
                    `); 
                    return request?.tires.map(value => {
                        return {
                            idTire: value.idTire,
                            name: value.tireModel.tireBrand.brandName + " " + value.tireModel.modelName + " " + value.serialNumber
                        }
                    }) ?? []; 
                },
                //---------------------------------------------------------------------------------------
                // async insert(values: IEquipment){
                //     type T =  { createEquipment: { name: string; }; } | undefined;
                //     const created: T = await apiClient.mutation<T>(gql`
                //         mutation CreateEquipment($createInput: CreateEquipmentInput!) {
                //             createEquipment(createInput: $createInput) {
                //                 name
                //             }
                //         }
                //     `, {createInput: values}); 

                //     if(created?.createEquipment.name) {
                //         props.showToast("success", `Добавлен новый транспорт: ${created.createEquipment.name}`)
                //         signalEmmiter.emit();
                //     } else {
                //         props.showToast("error", `Ошибка при создании нового транспорта`)
                //     }
                //     return values
                // },
                // //---------------------------------------------------------------------------------------
                // async update(key, values){
                //     type T = { updateEquipment: { name: string; }; } | undefined; 
                //     const updated: T = await apiClient.mutation<T>(gql`
                //         mutation UpdateEquipment($ident: Int!, $updateInput: UpdateEquipmentInput!) {
                //             updateEquipment(ident: $ident, updateInput: $updateInput) {
                //                 name
                //             }
                //         }
                //     `, {ident:key, updateInput: values}); 
                //     if(updated?.updateEquipment.name){
                //         props.showToast("success", `Транспорт успешно обновлен: ${updated?.updateEquipment.name}`)
                //         signalEmmiter.emit();
                //     } else {
                //         props.showToast("error", `Ошибка при обновлении транспорта`)
                //     }
                // },
                // //---------------------------------------------------------------------------------------
                // async remove(key: number) {
                //     type T = { deleteEquipment: number } | undefined
                //     const deleted:T = await apiClient.mutation<T>(gql`
                //         mutation DeleteEquipment($ident: Int!) {
                //             deleteEquipment(ident: $ident)
                //         }
                //     `, { ident: key });
                //     if (deleted && deleted.deleteEquipment > 0) {
                //         props.showToast("success", `Транспорт успешно удален (ID: ${key})`);
                //         signalEmmiter.emit();
                //     } else {
                //         props.showToast("error", `Ошибка при удалении транспорта`);
                //     }
                // }
                //---------------------------------------------------------------------------------------
            })
        })
    },[])

    return {
        dataSource
    }

}