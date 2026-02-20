import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { useTireSeasonalityTypeViewModel } from "../viewmodel/useTireSeasonalityTypeViewModel"
import { useTireSeasonalityTypeModel } from "../model/useTireSeasonalityType"
import { TireSeasonalityTypeGrid } from "./TireSeasinalityType.grid"


export const TireSeasonalityTypePage = () => {
    
    const { showToast } = useContext(ToastContext)

    const { dataSource } = useTireSeasonalityTypeModel({showToast})
    
    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useTireSeasonalityTypeViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    return<div className="v-box">
        <TireSeasonalityTypeGrid 
            dataSource={dataSource} 
            dgRef={dgRef} 
            onEditingCancelCallback={onEditingCancelCallback}
            onInitNewRowCallback={onInitNewRowCallback} 
            onRowInsertedCallback={onRowInsertedCallback} 
            onEditingStartCallback={onEditingStartCallback} 
            onTitleRenderCallback={onTitleRenderCallback} 
            onFormPopupShownCallback={onFormPopupShownCallback} />
    </div>
}