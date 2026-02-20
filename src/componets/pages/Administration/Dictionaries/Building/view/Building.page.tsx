import { useContext, type JSX } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useBuildingModel } from "../model/useBuildingModel"
import { useBuildingViewModel } from "../viewmodel/useBuildingViewModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { BuildingGrid } from "./Building.grid"
import type { EventInfo } from "devextreme/events"
import type { IBuilding } from "../../../../../../interfaces/IBuilding"

export const BuildingPage: React.FC = () => {
    
    const { showToast } = useContext(ToastContext)
    
    const {
        dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useBuildingViewModel()

    const { buildingTypeLookups, dataSource } = useBuildingModel({ showToast, dgRef })

    const { onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup({eventDataGridRef})

    return<div className="v-box">
        <BuildingGrid 
            dataSource={dataSource} 
            buildingTypeLookups={buildingTypeLookups} 
            dgRef={dgRef} 
            onEditingCancelCallback={onEditingCancelCallback} 
            onInitNewRowCallback={onInitNewRowCallback} 
            onRowInsertedCallback={onRowInsertedCallback} 
            onEditingStartCallback={onEditingStartCallback} 
            onTitleRenderCallback={onTitleRenderCallback} 
            onFormPopupShownCallback={onFormPopupShownCallback}       
        />
    </div>
}