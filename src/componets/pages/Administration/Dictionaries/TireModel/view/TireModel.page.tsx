import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useTireModelViewModel } from "../viewmodel/useTireModelViewModel"
import { useTireModelData } from "../model/useTireModelData"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { TireModelGrid } from "./TireModel.grid"

export const TireModelPage: React.FC = () => {
    
    const { showToast } = useContext(ToastContext)
    
    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useTireModelViewModel()

    const { 
        dataSource,
        tireSizeLookup,
        tireBrandLookup,
        tireCarcasTypeLookup,
        tireSeasonalityTypeLookup,
    } = useTireModelData({showToast, dgRef})

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    
    return <div className="v-box">
        <TireModelGrid 
            dataSource={dataSource} 
            dgRef={dgRef} 
            tireSizeLookup={tireSizeLookup}
            tireBrandLookup={tireBrandLookup}
            tireCarcasTypeLookup={tireCarcasTypeLookup}
            tireSeasonalityTypeLookup={tireSeasonalityTypeLookup}
            onEditingCancelCallback={onEditingCancelCallback} 
            onInitNewRowCallback={onInitNewRowCallback} 
            onRowInsertedCallback={onRowInsertedCallback} 
            onEditingStartCallback={onEditingStartCallback} 
            onTitleRenderCallback={onTitleRenderCallback} 
            onFormPopupShownCallback={onFormPopupShownCallback} 
        />
    </div>
}