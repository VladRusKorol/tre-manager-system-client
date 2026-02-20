import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";

import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { ITireBrand } from "../../../../../../interfaces/ITireBrand";

const initEventDataGridRef: TEventDataGridRef<ITireBrand> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО БРЕНДА В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useTireBrandViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<ITireBrand>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<ITireBrand, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<ITireBrand, number>> & NewRowInfo<ITireBrand>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<ITireBrand, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ ТИПА БРЕНДА",
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