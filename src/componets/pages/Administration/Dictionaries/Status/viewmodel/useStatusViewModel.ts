import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";

import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { IStatus } from "../../../../../../interfaces/IStatus";

const initEventDataGridRef: TEventDataGridRef<IStatus> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО УЧЕТНОГО СТАТУСА В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useStatusViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<IStatus>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<IStatus, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<IStatus, number>> & NewRowInfo<IStatus>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<IStatus, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ УЧЕТНОГО СТАТУСА",
            popupTitleEditName: e.data.status as string
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