import { useCallback, useRef } from "react";
import type { TEventDataGridRef } from "../../Locations/viewmodel/useLocationViewModel";

import type { DataGrid } from "devextreme-react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { ITireSeasonalityType } from "../../../../../../interfaces/ITireSeasonalityType";

const initEventDataGridRef: TEventDataGridRef<ITireSeasonalityType> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО ТИПА СЕЗОННОСТИ В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}


export const useTireSeasonalityTypeViewModel = () => {
    const eventDataGridRef = useRef<TEventDataGridRef<ITireSeasonalityType>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<ITireSeasonalityType, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<ITireSeasonalityType, number>> & NewRowInfo<ITireSeasonalityType>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<ITireSeasonalityType, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ ТИПА СЕЗОННОСТИ ",
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