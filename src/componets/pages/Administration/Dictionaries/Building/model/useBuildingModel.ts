import CustomStore from "devextreme/data/custom_store"
import DataSource from "devextreme/data/data_source"
import { useEffect, useMemo } from "react"
import type { IBuilding } from "../../../../../../interfaces/IBuilding"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"
import type { DataGrid } from "devextreme-react"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<IBuilding, number> | null>
}

const signalEmitter= new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_BUILDING_DATA,
    [
        SIGNAL_EMMITER_CONST.REFRESH_BUILDING_TYPE_DATA
    ]
)

export const useBuildingModel = ( props: IProps) => {
    const dataSource = useMemo(()=>{
        return new DataSource<IBuilding,number>({
             store: new CustomStore<IBuilding,number>({
                key: "idBuilding",
                async load(){
                    type T = { buildings: IBuilding[] } | undefined
                    const request: T = await apiClient.query<T>(gql`
                        query Buildings {
                            buildings {
                                idBuilding
                                name
                                idBuildingType
                                buildingType {
                                    idBuildingType
                                }
                                location {
                                    idLocation
                                }
                            }
                        }                       
                    `);
                    return request?.buildings ?? [];
                },
                async insert(values: IBuilding) {
                    type T = { createBuilding: { name : string } } | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation CreateBuilding($createInput: CreateBuildingInput!) {
                            createBuilding(createInput: $createInput) {
                                name
                            }
                        }
                    `,{createInput : { name: values.name, idBuildingType: values.idBuildingType }})
                    if(request?.createBuilding){
                        props.showToast("success",` Здание создано ${request?.createBuilding.name}`)   
                        signalEmitter.emit()
                    }
                    return values
                },
                
                async update(key, values) {
                    console.log(values)
                    console.log(key)
                    type T = { updateBuilding: { name: string }} | undefined
                    const request: T = await apiClient.mutation<T>(gql`   
                        mutation UpdateBuilding($ident: Int!, $updateInput: UpdateBuildingInput!) {
                            updateBuilding(ident: $ident, updateInput: $updateInput) {
                                name
                            }
                        }                          
                    `,{ ident: key, updateInput: { name: values.name, idBuildingType: values.idBuildingType}})
                    if(request?.updateBuilding.name){
                        props.showToast("success",` Здание обновлено ${request?.updateBuilding.name}`)   
                        signalEmitter.emit()
                    }
                    return values

                },

                async remove(key){
                    type T = { deleteBuilding: number } | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation DeleteBuilding($ident: Int!) {
                            deleteBuilding(ident: $ident)
                        }                       
                    `,{ ident: key})
                    if(request?.deleteBuilding){
                        props.showToast("success",` Здание удалено ID: ${request?.deleteBuilding}`)   
                        signalEmitter.emit()
                    }
                }
             })
        })
    },[])

    const buildingTypeLookups = useMemo(()=>{
        return new CustomStore({
            async load(){
                type T = { buildingTypes: { idBuildingType : number, name: string }[] } | undefined
                const request: T = await apiClient.query<T>(gql`
                    query Query {
                        buildingTypes {
                            idBuildingType
                            name
                        }
                    }
                `);
                return request?.buildingTypes ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])



    useEffect(() => {

        const handleRefresh = () => {
            buildingTypeLookups.clearRawDataCache();
            buildingTypeLookups.load();
            dataSource.load(); 
            props.dgRef.current?.instance.refresh();
        };

        signalEmitter.on(handleRefresh);

        return () => signalEmitter.off(handleRefresh)
    }, [dataSource]);

    return {
        dataSource,
        buildingTypeLookups
    }
}