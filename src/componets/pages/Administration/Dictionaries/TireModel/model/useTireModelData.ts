import CustomStore from "devextreme/data/custom_store"
import DataSource from "devextreme/data/data_source"
import { useEffect, useMemo } from "react"
import type { ITireModel } from "../../../../../../interfaces/ITireModel"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { TMessageType } from "../../../../../../contexts/ToastContext"
import type { DataGrid } from "devextreme-react"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"

interface IProps {
    showToast: (messageType: TMessageType, message: string) => void,
    dgRef: React.RefObject<DataGrid<ITireModel, number> | null>
}

const signalEmmiter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_TIRE_MODEL,
    [
        SIGNAL_EMMITER_CONST.REFRESH_TIRE_BRAND,
        SIGNAL_EMMITER_CONST.REFRESH_TIRE_SEASONALITY_TYPE,
        SIGNAL_EMMITER_CONST.REFRESH_TIRE_SIZE,
        SIGNAL_EMMITER_CONST.REFRASH_TIRE_CARCAS_TYPE
    ]
)


export const useTireModelData = (props: IProps) => {

    const dataSource = useMemo(()=>{
        return new DataSource<ITireModel, number>({
            store: new CustomStore<ITireModel, number>({
                
                key: "idTireModel",
                
                async load(): Promise<ITireModel[]>{
                    type T = { tireModels: ITireModel[] } | undefined
                    const request: T = await apiClient.query<T>(gql`
                        query TireModels {
                            tireModels {
                                idTireModel
                                minimalMiliage
                                name
                                idTireBrand
                                normalMiliage
                                protectorDepth
                                idTireCarcasType
                                idTireSeasonalityType
                                idTireSize
                                tires {
                                    idTire
                                }
                            }
                        }                        
                    `);
                    return request?.tireModels ?? [];
                },

                async insert(values: ITireModel){
                    type T = { createTireModel: { name: string }} | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation CreateTireModel($input: CreateTireModelInput!) {
                            createTireModel(input: $input) {
                                name
                            }
                        }    
                    `,{input: { ... values }});
                    if(request?.createTireModel.name){
                        props.showToast("success", `Создана новая модель ${request?.createTireModel.name}`);
                        signalEmmiter.emit();
                    } 
                    return values
                },

                async update (key, values){
                    type T = { updateTireModelById: { name: string }} | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation UpdateTireModelById($ident: Int!, $input: UpdateTireModelInput!) {
                            updateTireModelById(ident: $ident, input: $input) {
                                name
                            }
                        } 
                    `,{ident: key, input: { ...values }});
                    if(request?.updateTireModelById.name){
                        props.showToast("success",`Модель успешно обновлена ${request?.updateTireModelById.name}`)
                        signalEmmiter.emit();
                    } 
                },

                async remove(key) {
                    type T = { deleteTireModelById: number } | undefined
                    const request: T = await apiClient.mutation<T>(gql`
                        mutation DeleteTireModelById($ident: Int!) {
                            deleteTireModelById(ident: $ident)
                        }
                    `,{ident: key});
                    if(request?.deleteTireModelById){
                        props.showToast("success", `Модель успешно удалена (ID: ${key})`)
                        signalEmmiter.emit();
                    } 
                }
            })
        })
    },[]);

    const tireBrandLookup = useMemo(()=>{
        return new CustomStore<{ idTireBrand: number, name: string }>({
            key: "idTireBrand", 
            load: async () => {
                const request: { tireBrands: { idTireBrand: number, name: string }[] } | undefined = await apiClient.query< { tireBrands: { idTireBrand: number, name: string }[] }>(gql`
                    query TireBrands {
                        tireBrands {
                            idTireBrand
                            name
                        }
                    }
                `);
                return request?.tireBrands ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const tireCarcasTypeLookup = useMemo(()=>{
        return new CustomStore<{ idTireCarcasType: number, name: string }>({
            key: "idTireCarcasType", 
            load: async () => {
                const request: { tireCarcasTypes: { idTireCarcasType: number, name: string }[] } | undefined = await apiClient.query<{ tireCarcasTypes: { idTireCarcasType: number, name: string }[] }>(gql`
                    query TireCarcasTypes {
                        tireCarcasTypes {
                            idTireCarcasType
                            name
                        }
                    }
                `);
                return request?.tireCarcasTypes ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const tireSeasonalityTypeLookup = useMemo(()=>{
        return new CustomStore<{ idTireSeasonalityType: number, name: string }>({
            key: "idTireSeasonalityType", 
            load: async () => {
                const request: { tireSeasonalityTypes: { idTireSeasonalityType: number, name: string }[] } | undefined = await apiClient.query<{ tireSeasonalityTypes: { idTireSeasonalityType: number, name: string }[] }>(gql`
                    query TireSeasonalityTypes {
                        tireSeasonalityTypes {
                            idTireSeasonalityType
                            name
                        }
                    }
                `);
                return request?.tireSeasonalityTypes ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const tireSizeLookup = useMemo(()=>{
        return new CustomStore<{ idTireSize: number, size: string }>({
            key: "idTireSize", 
            load: async () => {
                const request: { tireSizes: { idTireSize: number, size: string }[] } | undefined = await apiClient.query<{ tireSizes: { idTireSize: number, size: string }[] }>(gql`
                    query TireSizes {
                        tireSizes {
                            idTireSize
                            size
                        }
                    }
                `);
                return request?.tireSizes ?? []
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])


    useEffect(() => {
    
        const handleRefresh = () => {

            tireBrandLookup.clearRawDataCache();
            tireBrandLookup.load();

            tireCarcasTypeLookup.clearRawDataCache();
            tireCarcasTypeLookup.load();

            tireSeasonalityTypeLookup.clearRawDataCache();
            tireSeasonalityTypeLookup.load();

            tireSizeLookup.clearRawDataCache();
            tireSizeLookup.load();

            dataSource.load(); 
            props.dgRef.current?.instance.refresh();
        };

        signalEmmiter.on(handleRefresh);

        return () => signalEmmiter.off(handleRefresh)
    }, [dataSource]);


    return {
        dataSource,
        tireSizeLookup,
        tireBrandLookup,
        tireCarcasTypeLookup,
        tireSeasonalityTypeLookup,
    }
    
}