import { useContext } from "react"
import { BuildingTypeGrid } from "./BuildingType.grid"
import { Toast } from "devextreme-react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useBuildingTypeModel } from "../model/useBuildingTypeModel"
import { useBuildingTypeViewModel } from "../viewmodel/useBuildingTypeViewMode"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"

export const BuildingTypePage: React.FC = () => {

    const { showToast } = useContext(ToastContext)

    const { dataSource } = useBuildingTypeModel({ showToast })

    const { dgRef, eventDataGridRef, onEditingCancelCallback, onEditingStartCallback, onInitNewRowCallback, onRowInsertedCallback } = useBuildingTypeViewModel()

    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    return <div className="v-box">
        <BuildingTypeGrid
            dataSource={dataSource}
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