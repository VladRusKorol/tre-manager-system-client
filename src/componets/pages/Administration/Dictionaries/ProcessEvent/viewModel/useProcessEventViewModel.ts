import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";
import type { IProcessEvent } from "../../../../../../interfaces/IProcessEvent";
import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";

const initEventDataGridRef: TEventDataGridRef<IProcessEvent> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО УЧЕТНОГО ПРОЦЕССА В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useProcessEventViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<IProcessEvent>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<IProcessEvent, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<IProcessEvent, number>> & NewRowInfo<IProcessEvent>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<IProcessEvent, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ УЧЕТНОГО ПРОЦЕССА",
            popupTitleEditName: e.data.processEventName as string
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