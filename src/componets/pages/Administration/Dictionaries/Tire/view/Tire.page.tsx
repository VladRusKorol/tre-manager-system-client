import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useTireModelViewModel } from "../viewmodel/useTireViewModel"
import { useTireModel } from "../model/useTireModel"
import { useCustomRenderHeaderPopup } from "../../../../../../common/useCustomRenderHeaderPopup"
import { TireGrid } from "./Tire.grid"
import { UpdateTirePopup } from "./Tire.update.popup"

export const TirePage: React.FC = () => {
    

    const { showToast } = useContext(ToastContext)

        const { dgRef,
        eventDataGridRef,
        onEditingCancelCallback,
        onEditingStartCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,

        isVisibleUpdatePopup,
        closeUpdateTirePopup,
        openUpdateTirePopup,
        updateKey
    } = useTireModelViewModel()
    
    const { 
        dataSource,
        tireModelLookup
    } = useTireModel({showToast, dgRef})




    
    const {onFormPopupShownCallback, onTitleRenderCallback } = useCustomRenderHeaderPopup( { eventDataGridRef })

    
    return<>
        <TireGrid 
            dataSource={dataSource}
            dgRef={dgRef}
            tireModelLookup={tireModelLookup}
            onEditingCancelCallback={onEditingCancelCallback}
            onInitNewRowCallback={onInitNewRowCallback}
            onRowInsertedCallback={onRowInsertedCallback}
            onEditingStartCallback={onEditingStartCallback}
            onTitleRenderCallback={onTitleRenderCallback}
            onFormPopupShownCallback={onFormPopupShownCallback} 
            openUpdateTirePopup={openUpdateTirePopup}
        />

        <UpdateTirePopup 
            key={new Date().getMilliseconds()} 
            isVisible={isVisibleUpdatePopup} 
            onHiding={closeUpdateTirePopup} 
            dgRef={dgRef} 
            tireModelLookup={tireModelLookup} 
            tireKey={updateKey}            
        />
    </>
}