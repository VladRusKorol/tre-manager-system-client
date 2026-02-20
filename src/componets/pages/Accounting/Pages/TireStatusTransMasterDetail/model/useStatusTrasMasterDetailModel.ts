import CustomStore from "devextreme/data/custom_store"
import DataSource from "devextreme/data/data_source"
import { useMemo } from "react"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { ITireStatusTrans } from "../../../../../../interfaces/ITireStatusTrans"

interface IProps {
    tireKey: number
}

export const useStatusTrasMasterDetailModel = (props: IProps) => {
    
    const dataSource = useMemo(()=>{
        return new DataSource<ITireStatusTrans,number>({
            store: new CustomStore<ITireStatusTrans,number>({
                key: "idTireStatusTrans",
                async load() {
                    type T = { tireStatusTransByIdTire: ITireStatusTrans [] } | undefined
                    const request: T = await apiClient.queryWithVars<T>( gql`
                       query TireStatusTransByIdTire($ident: Int!) {
                            tireStatusTransByIdTire(ident: $ident) {
                                idTireStatusTrans
                                idTireStatusTransPrev
                                idLocation
                                idStatus
                                idTire
                                idTirePosition
                                idProcessEvent
                                startTimestamp
                                startDate
                                endTimestamp
                                endDate
                                comment
                                startMiliage
                                endMiliage
                                durationMiliage
                            }
                        } 
                    `,{ident: props.tireKey})
                    console.log(`props.tireKey ${props.tireKey}`)
                    
                    return request?.tireStatusTransByIdTire ?? []
                }
            })
        })
    },[])

    const locationLookup = useMemo(()=>{
        return new CustomStore<{ idLocation: number, displayName: string}>({
            key: "idLocation",
            async load(){
                type T = { locations: { idLocation: number, displayName: string}[] } | undefined
                const request: T = await apiClient.query<T>( gql`
                    query Locations {
                        locations {
                            idLocation
                            displayName
                        }
                    }
                `);
                console.log(request)
                return request?.locations ?? [];
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const statusLookup = useMemo(()=>{
        return new CustomStore<{ idStatus: number, status: string}>({
            key: "idStatus",
            async load(){
                type T = { statuses: { idStatus: number, status: string}[] } | undefined
                const request: T = await apiClient.query<T>( gql`
                    query Statuses {
                        statuses {
                            idStatus
                            status
                        }
                    }
                `);
                return request?.statuses ?? [];
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    // const tireLookup = useMemo(()=>{
    //     return new CustomStore({
    //         key: "idTire",
    //         async load(){
    //             type T = { tires: { idTire: number, tireNumber: string}[] } | undefined
    //             const request: T = await apiClient.query<T>( gql`
    //                 query Tires {
    //                     tires {
    //                         idTire
    //                         tireNumber
    //                     }
    //                 }
    //             `);
    //             return request?.tires ?? [];
    //         },
    //         useDefaultSearch: true,
    //         loadMode: "raw"
    //     })
    // },[])

    const tirePositionLookup = useMemo(()=>{
        return new CustomStore({
            key: "idTirePosition",
            async load(){
                type T = { tirePositions: { idTirePosition: number, name: string}[] } | undefined
                const request: T = await apiClient.query<T>( gql`
                    query TirePositions {
                        tirePositions {
                            idTirePosition
                            name
                        }
                    }
                `);
                return request?.tirePositions ?? [];
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    const processEventLookup = useMemo(()=>{
        return new CustomStore<{ idProcessEvent: number, processEventNam: string}>({
            key: "idProcessEvent",
            async load(){
                type T = { processEvents: { idProcessEvent: number, processEventNam: string}[] } | undefined
                const request: T = await apiClient.query<T>( gql`
                    query ProcessEvents {
                        processEvents {
                            idProcessEvent
                            processEventName
                        }
                    }
                `);
                return request?.processEvents ?? [];
            },
            useDefaultSearch: true,
            loadMode: "raw"
        })
    },[])

    return {
        dataSource,
        locationLookup,
        statusLookup,
        // tireLookup,
        tirePositionLookup,
        processEventLookup
    }
}
