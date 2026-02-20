import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";
import type { IBuildingType } from "../../../../../../interfaces/IBuildingType";
import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";

const initEventDataGridRef: TEventDataGridRef<IBuildingType> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО ТИПА ЗДАНИЯ В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useBuildingTypeViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<IBuildingType>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<IBuildingType, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<IBuildingType, number>> & NewRowInfo<IBuildingType>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<IBuildingType, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ ТИПА ЗДАНИЯ",
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