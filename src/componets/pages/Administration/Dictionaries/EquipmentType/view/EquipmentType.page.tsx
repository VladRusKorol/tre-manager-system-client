import { useCallback, useContext } from "react";
import { useEquipmentTypeModel } from "../model/useEquipmentTypeModel"
import { ToastContext } from "../../../../../../contexts/ToastContext";
import { useEquipmentTypeViewModel } from "../viewmodel/useEquipmentTypeViewModel";
import { EquipmentTypeGrid } from "./EquipmentType.grid";

interface IProps {

}

export const EquipmentTypesPage : React.FC<IProps> = () => {

    const { showToast } = useContext(ToastContext); 
    
    

    const {
        dgRef,
        eventDataGridRef,

        onFilterSwitchCallback,

        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback
    } = useEquipmentTypeViewModel()

    const { dataSource } = useEquipmentTypeModel({showToast, dgRef})

    const onTitleRenderCallback = useCallback(()=>{
        switch(eventDataGridRef.current.event){
            case "new": {
                return(
                    <div className="h-box" style={{justifyContent:"center"}}>
                        <h2>
                            <span>{ eventDataGridRef.current.popupTitle }</span>
                        </h2>
                    </div>
                )
            }
            case "edit": {
                return(
                    <div className="h-box" style={{justifyContent:"center"}}>
                        <h2>
                            <span style={{ color: "DimGray"}}>{ eventDataGridRef.current.popupTitle } </span>
                            <span style={{ color: "black", fontWeight: "bold"}}>
                                { eventDataGridRef.current.popupTitleEditName }
                            </span>
                        </h2>
                    </div>
                )
            }
        }
    },[eventDataGridRef])

    const onFormPopupShownCallback = useCallback((e: any)=>{
        e.component.repaint()
    },[])

    return <div className="v-box">
        <EquipmentTypeGrid
            dataSource={dataSource}
            dgRef={dgRef}
            onFilterSwitchCallback={onFilterSwitchCallback}
            onEditingCancelCallback={onEditingCancelCallback}
            onInitNewRowCallback={onInitNewRowCallback}
            onRowInsertedCallback={onRowInsertedCallback}
            onEditingStartCallback={onEditingStartCallback}
            onTitleRenderCallback={onTitleRenderCallback}
            onFormPopupShownCallback={onFormPopupShownCallback}
        />
    </div>
}
    