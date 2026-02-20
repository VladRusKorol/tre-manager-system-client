import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";

import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { ITireCarcasType } from "../../../../../../interfaces/ITireCarcasType";

const initEventDataGridRef: TEventDataGridRef<ITireCarcasType> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО ТИПА КАРКАСА В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useTireCarcasTypeViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<ITireCarcasType>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<ITireCarcasType, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<ITireCarcasType, number>> & NewRowInfo<ITireCarcasType>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<ITireCarcasType, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ ТИПА КАРКАСА ",
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