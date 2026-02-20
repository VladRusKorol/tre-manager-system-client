import { useEffect } from "react"
import { useDashboardModel } from "../model/useDashboardModel"
import { Statics } from "../Componets/Statics/Static.component"
import { LocationCard } from "../Componets/LocationCard/LocationCard"
import type { ILocationDashboard } from "../../../../../../interfaces/IDashboard"
import { ScrollableListLocations } from "../Componets/ScrollListLocations/ScrollableListLocations"
import { useMoveTireViewModel } from "../viewmodel/useMoveTireViewModel"
import { MoveTirePopup } from "../Componets/MoveStatusPopup/view/MoveTire.popup"
import { SignalEmmiter } from "../../../../../../common/SignalEmmiter"


export const DashboardPage: React.FC = () => {

    const { 
        loadDashBoardData,
        totalBuildingTires,
        totalEquipmentTires,
        totalTires,
        totalEmptyLocations,
        equipmentsLocationDashboard,
        buildingLocationDashboard
    } = useDashboardModel()

    const {
        enteIidTire,
        isVisibleMoveTirePopup,
        closeMoveTirePopup,
        openMoveTirePopup
    } = useMoveTireViewModel()
    
    useEffect(()=>{
        loadDashBoardData()
    },[])

    return<div className="v-box" style={{width:"100%", height: "100%", overflow: "hidden"}}>
        <Statics 
            buildingsTires={totalBuildingTires} 
            emptyLocations={totalEmptyLocations} 
            totalTires={totalTires} 
            vehiclesTires={totalEquipmentTires}
        />
        <div className="h-box" style={{width:"100%", height: "100%", overflow: "hidden"}}>
            <div 
                className="v-box" 
                style={{ width:"100%", height: "100%", alignItems: "center" }}>
                <h2 style={{ color: "gray", fontFamily: "emoji"}}>
                    НА ОБОРУДОВАНИИ
                </h2>
                <div className="v-box" style={{width:"100%", height: "100%", padding: "10px"}}>
                    <ScrollableListLocations dataArray={equipmentsLocationDashboard} type="vehicle" openMoveTirePopup={openMoveTirePopup}/>
                </div>
            </div>

            <div 
                className="v-box" 
                style={{ width:"100%", height: "100%", alignItems: "center" }}>
                <h2 style={{ color: "gray", fontFamily: "emoji"}}>
                    В ЗДАНИЯХ
                </h2>
                <div className="v-box" style={{width:"100%", height: "100%", padding: "10px"}}>
                    <ScrollableListLocations dataArray={buildingLocationDashboard} type="building" openMoveTirePopup={openMoveTirePopup}/>
                </div>
            </div>

        </div>
        <MoveTirePopup 
            key={new Date().getMilliseconds()} 
            isVisible={isVisibleMoveTirePopup} 
            onHiding={closeMoveTirePopup} 
            enterIdTire={enteIidTire}        
        />
    </div>
}