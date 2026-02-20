import { useCallback, useContext } from "react"
import { useEquipmentModel } from "../model/useEquipmentModel"
import { EquipmentGrid } from "./Equipments.grid"
import { useEquipmentViewModel } from "../viewmodel/useEquipmentViewModel"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import type { IEquipment } from "../../../../../../interfaces/IEquipment"

interface IProps {
}

export const EquipmentsPage: React.FC<IProps> = () => {

    const {
        dgRef,
        eventDataGridRef,
        onFilterSwitchCallback,
        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback
    } = useEquipmentViewModel(); 

    const { showToast } = useContext(ToastContext); 

    const { 
        dataSource,
        EquipmentTypesLoockUp,
        EquipmentModelsLoockUp
    } = useEquipmentModel({
        showToast,
        dgRef
    })


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
        <EquipmentGrid 
            dataSource={dataSource} 
            EquipmentTypesLoockUp={EquipmentTypesLoockUp} 
            EquipmentModelsLoockUp={EquipmentModelsLoockUp} 
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