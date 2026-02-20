import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";

import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { ITireSize } from "../../../../../../interfaces/ITireSize";

const initEventDataGridRef: TEventDataGridRef<ITireSize> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО РАЗМЕРА В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useTireSizeViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<ITireSize>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<ITireSize, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<ITireSize, number>> & NewRowInfo<ITireSize>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<ITireSize, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ РАЗМЕРА",
            popupTitleEditName: e.data.size as string
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