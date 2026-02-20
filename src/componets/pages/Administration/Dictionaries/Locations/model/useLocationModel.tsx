import DataSource from "devextreme/data/data_source"
import { useEffect, useMemo } from "react"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import CustomStore from "devextreme/data/custom_store"
import type { ILocation } from "../../../../../../interfaces/ILocation"
import type { ILocationType } from "../../../../../../interfaces/ILocationType"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import type { DataGrid } from "devextreme-react"
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<ILocation, number> | null>
}

const signalEmmiter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_LOCATION_DATA,
    [
        SIGNAL_EMMITER_CONST.REFRESH_EQUIPMENTS_DATA,
        SIGNAL_EMMITER_CONST.REFRESH_BUILDING_DATA
    ]
)

export const useLocationModel = (props: IProps) => {

    const dataSource = useMemo(() => {
        return new DataSource<ILocation, number>({
            store: new CustomStore<ILocation, number>({

                key: "idLocation",

                async byKey(key: number): Promise<ILocation> {
                    const request = await apiClient.queryWithVars<{ locationByPK: ILocation }>(gql`
                        query LocationByPK($ident: Int!) {
                            locationByPK(ident: $ident) {
                                idLocation
                                displayName
                                idBuilding
                                idEquipment
                                idLocationType
                            }
                        }
                    `, { ident: key });

                    if (request?.locationByPK) {
                        return request.locationByPK;
                    }
                    
                    props.showToast("error", `Ошибка при поиске локации с ID: ${key}`);
                    throw new Error(`Location ${key} not found`);
                },

                async load() {
                    const request = await apiClient.query<{ locations: ILocation[] }>(gql`
                        query Locations {
                            locations {
                                idLocation
                                displayName
                                idEquipment
                                idBuilding
                                idLocationType
                            }
                        }  
                    `);
                    return request?.locations ?? [];
                },

                async insert(values: ILocation) {
                    type T = { createLocation: { displayName: string } }
                    const created = await apiClient.mutation<T>(gql`
                        mutation CreateLocation($createnput: CreateLocationInput!) {
                            createLocation(createnput: $createnput) {
                                displayName
                            }
                        }
                    `, { 
                        createnput: { 
                            idLocationType: values.idLocationType, 
                            idEquipment: values.idEquipment, 
                            idBuilding: values.idBuilding, 
                            displayName: values.displayName
                        }
                    });

                    if (created?.createLocation.displayName) {
                        props.showToast("success", `Добавлена новая локация: ${created.createLocation.displayName}`);
                        signalEmmiter.emit();
                    } else {
                        props.showToast("error", `Ошибка при создании новой локации`);
                    }
                    return values;
                },

                async update(key: number, values: Partial<ILocation>) {
                    type T = { updateLocation: { displayName: string } }
                    const updated = await apiClient.mutation<T>(gql`
                        mutation UpdateLocation($ident: Int!, $updateInput: UpdateLocationInput!) {
                            updateLocation(ident: $ident, updateInput: $updateInput) {
                                displayName
                            }
                        }
                    `, { ident: key, updateInput: values });

                    if (updated?.updateLocation.displayName) {
                        props.showToast("success", `Локация успешно обновлена: ${updated.updateLocation.displayName}`);
                        signalEmmiter.emit();
                    } else {
                        props.showToast("error", `Ошибка при обновлении локации`);
                    }
                },

                async remove(key: number) {
                    type T = { deleteLocation: number }
                    const deleted = await apiClient.mutation<T>(gql`
                        mutation DeleteLocation($ident: Int!) {
                            deleteLocation(ident: $ident)
                        }
                    `, { ident: key });

                    if (deleted && deleted.deleteLocation > 0) {
                        props.showToast("success", `Локация успешно удалена (ID: ${key})`);
                        signalEmmiter.emit();
                    } else {
                        props.showToast("error", `Ошибка при удалении локации`);
                    }
                }
            })
        });
    }, []);


    const locationTypesLoockUp = useMemo(()=> {
        return new CustomStore<ILocationType>({
            key: "idLocationType",
            load: async () => {
                const request = await apiClient.query<{ locationTypes: ILocationType[] }>(gql`
                    query LocationTypes {
                        locationTypes {
                            idLocationType
                            name
                        }
                    }
                `)
                return request?.locationTypes ?? []; 
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const equipmentsLoockUp = useMemo(()=> {
        return new CustomStore<{idEquipment: number, name: string}>({
            key: "idEquipment",
            load: async () => {
                const request = await apiClient.query<{ equipments: {idEquipment: number, name: string}[] }>(gql`
                    query Equipments {
                        equipments {
                            idEquipment
                            name
                        }
                    }
                `)
                return request?.equipments ?? []; 
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const buildingsLoockUp = useMemo(()=> {
        return new CustomStore<{idBuilding: number, name: string}>({
            key: "idBuilding",
            load: async () => {
                const request = await apiClient.query<{ buildings: {idBuilding: number, name: string}[] }>(gql`
                    query Buildings {
                        buildings {
                            idBuilding
                            name
                        }
                    }
                `)
                return request?.buildings ?? []; 
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    useEffect(()=>{
        const handleRefresh = () => {

            locationTypesLoockUp.clearRawDataCache();
            locationTypesLoockUp.load();

            equipmentsLoockUp.clearRawDataCache();
            equipmentsLoockUp.load();

            buildingsLoockUp.clearRawDataCache();
            buildingsLoockUp.load();

            dataSource.load(); 
            props.dgRef.current?.instance.refresh();
        };
        signalEmmiter.on(handleRefresh);
        return () => signalEmmiter.off(handleRefresh)
    },[dataSource])

    return { 
        dataSource,
        locationTypesLoockUp,
        equipmentsLoockUp,
        buildingsLoockUp
    }
}