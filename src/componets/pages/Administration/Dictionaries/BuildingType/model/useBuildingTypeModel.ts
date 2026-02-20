import CustomStore from "devextreme/data/custom_store"
import DataSource from "devextreme/data/data_source"
import { useMemo } from "react"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { IBuildingType } from "../../../../../../interfaces/IBuildingType"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
}

const signalEmitter= new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_BUILDING_TYPE_DATA,[]
)

export const useBuildingTypeModel = (props: IProps) => {
    const dataSource = useMemo(()=>{
        return new DataSource<IBuildingType,number>({
            store: new CustomStore<IBuildingType,number>({
                key: "idBuildingType",
                async load(){
                    type T ={ buildingTypes: IBuildingType[] } | undefined
                    const request: T = await apiClient.query<T>(gql`
                        query BuildingTypes {
                            buildingTypes {
                                idBuildingType
                                name
                                buildings {
                                    idBuilding
                                }
                            }
                        }
                    `);
                    return request?.buildingTypes ?? []
                },
                async insert(values){
                    type T = { createBuildingType: { name: string } } | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation CreateBuildingType($createInput: CreateBuildingTypeInput!) {
                            createBuildingType(createInput: $createInput) {
                                name
                            }
                        }                        
                    `,{createInput: { name: values.name }});
                    if(request?.createBuildingType){
                        props.showToast("success", `Создан тип здания: ${request?.createBuildingType.name}`)
                        signalEmitter.emit()
                    }
                    return values;
                },
                async update(key, values){
                    type T = { updateBuildingType: { name: string }} | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation UpdateBuildingType($ident: Int!, $updateInput: UpdateBuildingTypeInput!) {
                            updateBuildingType(ident: $ident, updateInput: $updateInput) {
                                name
                            }
                        }
                    `,{ ident: key, updateInput: { name: values.name } })
                    if(request?.updateBuildingType){
                        props.showToast("success", `Тип здания успешно обновлен: ${request?.updateBuildingType.name}`);
                        signalEmitter.emit()
                    }
                },
                async remove(key) {
                    type T = { deleteBuildingType: number } | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation DeleteBuildingType($ident: Int!) {
                            deleteBuildingType(ident: $ident)
                        }
                    `,{ ident: key})
                    if(request?.deleteBuildingType){
                        props.showToast("success", `Тип здания успешно удален (ID: ${key})`)
                        signalEmitter.emit()
                    }
                },
            })
        })
    },[props])

    return {
        dataSource
    }
}