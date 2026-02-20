import { useCallback, useEffect, useMemo, useState } from "react"
import { apiClient } from "../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import type { IDashboard, ILocationDashboard } from "../../../../../../interfaces/IDashboard"
import { SIGNAL_EMMITER_CONST } from "../../../../../../common/SIGNAL_EMMITER_CONSTS"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"


const signalEmitter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.REFRESH_DASHBOARD_DATA,[
        SIGNAL_EMMITER_CONST.MOVE_TIRE
    ]
)

export const useDashboardModel = () => {

    const [totalTires, setTotalTires] = useState<number>(0)
    const [totalEquipmentTires, setTotalEquipmentTires] = useState<number>(0)
    const [totalBuildingTires, setTotalBuildingTires] = useState<number>(0)
    const [totalEmptyLocations, setTotalEmptyLocations] = useState<number>(0)
    const [equipmentsLocationDashboard, setEquipmentsLocationDashboard] = useState<ILocationDashboard[] | [] >([])
    const [buildingLocationDashboard, setBuildingLocationDashboard] = useState<ILocationDashboard[] | [] >([])

    const totalTiresCalculate = useCallback((data: IDashboard[])=> {
        let result: number = 0; 
        data.forEach((value:IDashboard)=> {
            value.locations.forEach((location) => {
                result += location.activeTires.length
            })
        })
        setTotalTires(result)
    },[]) 

    const totalEquipmentTiresCalculate = useCallback((data: IDashboard[])=> {
        let result: number = 0; 
        data.filter(value => value.locationTypeName === "Автомобиль").forEach((value:IDashboard)=> {
            value.locations.forEach((location) => {
                result += location.activeTires.length
            })
        })
        setTotalEquipmentTires(result)
    },[]) 

    const totalBuildingTiresCalculate = useCallback((data: IDashboard[])=> {
        let result: number = 0; 
        data.filter(value => value.locationTypeName === "Здание").forEach((value:IDashboard)=> {
            value.locations.forEach((location) => {
                result += location.activeTires.length
            })
        })
        setTotalBuildingTires(result)
    },[]) 

    const totalEmptyLocationsCalculate = useCallback((data: IDashboard[]) => {
        let result: number = 0; 
        data.forEach((value:IDashboard)=> {
            value.locations.forEach((location) => {
                if(location.activeTires.length === 0) {
                    result += 1;
                }
            })
        })
        setTotalEmptyLocations(result)
    },[])

    const equipmentsLocationDashboardCalulation = useCallback((data: IDashboard[])=>{
        const result: ILocationDashboard[] | []= data.find(value => value.locationTypeName === "Автомобиль")?.locations ?? []
        setEquipmentsLocationDashboard(result)
    },[])

    const equipmentsBuildingDashboardCalulation = useCallback((data: IDashboard[])=>{
        const result: ILocationDashboard[] | []= data.find(value => value.locationTypeName === "Здание")?.locations ?? []
        setBuildingLocationDashboard(result)
    },[])
    
    const loadDashBoardData = useCallback(async ()=>{
        type T = { locationTypes:  IDashboard[] } | undefined
        const request: T =  await apiClient.query<T>(gql`
            query LocationTypes {
                locationTypes {
                    locationTypeName: name
                    locations {
                    idLocation
                    locationName: displayName
                        activeTires {
                            idTire
                            tire {
                                serialNumber
                                tireModel {
                                    modelName: name
                                    tireBrand {
                                        tireBrandName: name
                                    }
                                }
                            }
                            tirePosition {
                                tirePositionName :name
                            }
                        }
                    }
                }
            }
        `);
        console.log(`request`)
        if(request){
            totalTiresCalculate(request.locationTypes);
            totalEquipmentTiresCalculate(request.locationTypes);
            totalBuildingTiresCalculate(request.locationTypes);
            totalEmptyLocationsCalculate(request.locationTypes);
            equipmentsLocationDashboardCalulation(request.locationTypes);
            equipmentsBuildingDashboardCalulation(request.locationTypes);
        }
    },[])

    useEffect(()=>{
        const handleRefresh = () => {
            loadDashBoardData()
        };
        signalEmitter.on(handleRefresh);
        return () => signalEmitter.off(handleRefresh)
    },[
        loadDashBoardData,
        totalTires,
        totalEquipmentTires,
        totalBuildingTires,
        totalEmptyLocations,
        equipmentsLocationDashboard,
        buildingLocationDashboard
    ])


    return {
        loadDashBoardData,
        totalTires,
        totalEquipmentTires,
        totalBuildingTires,
        totalEmptyLocations,
        equipmentsLocationDashboard,
        buildingLocationDashboard
    }
}