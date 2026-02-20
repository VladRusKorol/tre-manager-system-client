import { Toast } from "devextreme-react";
import { useContext } from "react";
import { ToastContext } from "../../../../../../contexts/ToastContext";
import { useWheelSchemaModel } from "../model/useWheelSchemaModel";
import { WheelSchemaGridMemo } from "./WheelSchema.grid";
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup";
import { useWheelSchemaViewModel } from "../viewmodel/useWheelSchemaViewModel";

export const WheelSchemaPage: React.FC = () => {
    
    const { showToast } = useContext(ToastContext);
    const { dgRef, eventDataGridRef, onEditingCancelCallback, onEditingStartCallback, onInitNewRowCallback, onRowInsertedCallback} = useWheelSchemaViewModel(); 
    const { masterDataSource, detailDataSource, tirePositionLoockUp, selectedRowKey, setSelectedRowKey} = useWheelSchemaModel({ showToast, dgRef}); 
    const { onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup({ eventDataGridRef })

    return  <div className="v-box">
        <WheelSchemaGridMemo
            dgRef={dgRef}
            masterDataSource={masterDataSource}
            detailDataSource={detailDataSource}
            tirePositionLoockUp={tirePositionLoockUp}
            selectedRowKey={selectedRowKey}
            setSelectedRowKey={setSelectedRowKey}
            onEditingCancelCallback ={onEditingCancelCallback}
            onInitNewRowCallback ={onInitNewRowCallback}
            onRowInsertedCallback ={onRowInsertedCallback}
            onEditingStartCallback ={onEditingStartCallback}
            onTitleRenderCallback ={onTitleRenderCallback}
            onFormPopupShownCallback ={onFormPopupShownCallback}
        />
    </div>
}