import { useContext, type JSX } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useEquipmentModelViewModel } from "../viewmodel/useEquipmentModelViewModel";
import { useEquipmentModelData } from "../model/useEquipmentModelData";
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup";
import { EquipmentModelGridMemo } from "./EquipmentModel.grid";
import type { EventInfo } from "devextreme/events";
import type { IEquipmentModel } from "../../../../../../interfaces/IEquipmentModel";

export const EquipmentModelPage: React.FC = () => {

    const { showToast } = useContext(ToastContext);
    
    const { dgRef, eventDataGridRef,
        onFilterSwitchCallback,
        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback
    } = useEquipmentModelViewModel()

    const { dataSource, wheelSchemaLookUp } = useEquipmentModelData({showToast, dgRef})

    const {  onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup({eventDataGridRef})

    return <div className="v-box">
        <EquipmentModelGridMemo 
        dataSource={dataSource} 
        wheelSchemaLookUp={wheelSchemaLookUp} 
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