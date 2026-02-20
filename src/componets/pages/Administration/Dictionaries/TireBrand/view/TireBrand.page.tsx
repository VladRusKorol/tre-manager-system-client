import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useTireBrandModel } from "../model/useTireBrandModel"
import { useTireBrandViewModel } from "../viewmodel/useTireBrandViewModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { TireBrandGrid } from "./TireBrand.grid"


export const TireBrandPage = () => {
    
    const { showToast } = useContext(ToastContext)

    const { dataSource } = useTireBrandModel({showToast})
    
    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useTireBrandViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    return<div className="v-box">
        <TireBrandGrid 
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