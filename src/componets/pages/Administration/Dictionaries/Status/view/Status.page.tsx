import { useContext, type JSX } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useStatusModel } from "../model/useStatusModel"
import { useStatusViewModel } from "../viewmodel/useStatusViewModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { StatusGrid } from "./Status.grid"

export const StatusPage: React.FC = () => {
    
    const { showToast } = useContext(ToastContext)

    const { dataSource } = useStatusModel({showToast})
    
    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useStatusViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    return<>
        <StatusGrid 
            dataSource={dataSource} 
            dgRef={dgRef} 
            onEditingCancelCallback={onEditingCancelCallback} 
            onInitNewRowCallback={onInitNewRowCallback} 
            onRowInsertedCallback={onRowInsertedCallback} 
            onEditingStartCallback={onEditingStartCallback} 
            onTitleRenderCallback={onTitleRenderCallback} 
            onFormPopupShownCallback={onFormPopupShownCallback}        
        />
    </>
}