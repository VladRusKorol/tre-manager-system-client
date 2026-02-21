import { useContext, type JSX } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useProcessEventModel } from "../model/useProcessEventModel"
import { useProcessEventViewModel } from "../viewModel/useProcessEventViewModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { ProcessEventGrid } from "./ProcessEvent.grid"
import type { EventInfo } from "devextreme/events"
import type { IProcessEvent } from "../../../../../../interfaces/IProcessEvent"

export const ProcessEventPage: React.FC = () => {
    
    const { showToast } = useContext(ToastContext)

    const { dataSource } = useProcessEventModel({showToast})

    const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback
    } = useProcessEventViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })
    
    return<>
        <ProcessEventGrid 
            dataSource={dataSource} 
            dgRef={dgRef} 
            onEditingCancelCallback={onEditingCancelCallback} 
            onInitNewRowCallback={onEditingCancelCallback} 
            onRowInsertedCallback={onRowInsertedCallback} 
            onEditingStartCallback={onEditingStartCallback} 
            onTitleRenderCallback={onTitleRenderCallback} 
            onFormPopupShownCallback={onFormPopupShownCallback}        
        />
    </>
}