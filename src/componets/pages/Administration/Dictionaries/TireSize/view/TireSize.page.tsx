import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useTireSizeModel } from "../model/useTireSizeModel"
import { useTireSizeViewModel } from "../viewmodel/useTireSizeViewModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { TireSizeGrid } from './TireSize.grid'


export const TireSizePage = () => {
    
    const { showToast } = useContext(ToastContext)

    const { dataSource } = useTireSizeModel({showToast})
    
    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useTireSizeViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    return<div className="v-box">
        <TireSizeGrid 
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