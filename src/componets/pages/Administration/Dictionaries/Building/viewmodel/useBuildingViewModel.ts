import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";
import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { IBuilding } from "../../../../../../interfaces/IBuilding";

const initEventDataGridRef: TEventDataGridRef<IBuilding> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО ЗДАНИЯ В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useBuildingViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<IBuilding>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<IBuilding, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<IBuilding, number>> & NewRowInfo<IBuilding>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<IBuilding, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ ЗДАНИЯ",
            popupTitleEditName: e.data.name as string
        }
    },[])
    //#endregion 

    return {
        eventDataGridRef,
        dgRef,
        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback
    }
}