import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useTireCarcasTypeModel } from "../model/useTireCarcasTypeModel"
import { useTireCarcasTypeViewModel } from "../viewmodel/useTireCarcasTypeViewModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { TireCarcasTypeGrid } from "./TireCarcasType.grid"


export const TireCarcasTypePage = () => {
    
    const { showToast } = useContext(ToastContext)

    const { dataSource } = useTireCarcasTypeModel({showToast})
    
    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useTireCarcasTypeViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    return<div className="v-box">
        <TireCarcasTypeGrid 
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