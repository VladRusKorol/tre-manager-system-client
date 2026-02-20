import { useCallback, useContext, type JSX } from "react"
import { useLocationModel } from "../model/useLocationModel"
import { useLocationViewModel } from "../viewmodel/useLocationViewModel"
import { LocationsGrid } from "./Locations.grid"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { CreateLocationPopup } from "./Location.create.popup"

interface IProps {

}

export const LocationsPage: React.FC<IProps> = () => {

    const { showToast } = useContext(ToastContext)
    
    const {
        dgRef,
        eventDataGridRef,

        onFilterSwitchCallback,

        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback,

        isVisibleCreatePopup,
        openCreateLocationPopup,
        openUpdateLoccationPopup,
        closeCreateLocationPopup,
        updateKey
    } = useLocationViewModel()

        const { 
        dataSource, 
        locationTypesLoockUp,
        equipmentsLoockUp,
        buildingsLoockUp
    } = useLocationModel({showToast, dgRef})

      const onTitleRenderCallback = useCallback(()=>{
            switch(eventDataGridRef.current.event){
                case "new": {
                    return(
                        <div className="h-box" style={{justifyContent:"center"}}>
                            <h1>
                                <span>{ eventDataGridRef.current.popupTitle }</span>
                            </h1>
                        </div>
                    )
                }
                case "edit": {
                    return(
                        <div className="h-box" style={{justifyContent:"center"}}>
                            <h1>
                                <span style={{ color: "DimGray"}}>{ eventDataGridRef.current.popupTitle } </span>
                                <span style={{ color: "black", fontWeight: "bold"}}>
                                    { eventDataGridRef.current.popupTitleEditName }
                                </span>
                            </h1>
                        </div>
                    )
                }
            }
        },[eventDataGridRef])
    
        const onFormPopupShownCallback = useCallback((e: any)=>{
            e.component.repaint()
        },[])

    return <div className="v-box">
        <LocationsGrid 
            dataSource={dataSource}
            locationTypesLoockUp={locationTypesLoockUp}
            equipmentsLoockUp={equipmentsLoockUp}
            buildingsLoockUp={buildingsLoockUp}
            dgRef={dgRef}
            onInitNewRowCallback={onInitNewRowCallback}
            onRowInsertedCallback={onRowInsertedCallback}
            onEditingStartCallback={onEditingStartCallback}
            onTitleRenderCallback={onTitleRenderCallback}
            onFormPopupShownCallback={onFormPopupShownCallback}
            onFilterSwitchCallback={onFilterSwitchCallback} 
            onEditingCancelCallback={onEditingCancelCallback}    
            openCreateLocationPopup={openCreateLocationPopup}    
            openUpdateLoccationPopup={openUpdateLoccationPopup}    
        />
        <CreateLocationPopup 
            onHiding={closeCreateLocationPopup}
            dgRef={dgRef}
            isVisible={isVisibleCreatePopup}
            locationKey={updateKey}
            key={new Date().getMilliseconds()}
        />
    </div>
}