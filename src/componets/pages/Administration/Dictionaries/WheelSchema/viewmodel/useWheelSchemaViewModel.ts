import { useCallback, useRef } from "react"
import type { IWheelSchema } from "../../../../../../interfaces/IWheelSchema"
import type { DataGrid } from "devextreme-react"
import type { EventInfo } from "devextreme/events"
import type dxDataGrid from "devextreme/ui/data_grid"
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid"

export type TEventDataGridRef<T> = {
    event: 'new' | 'edit',
    popupTitle: string | null,
    popupTitleEditName: string | null
}

const initEventDataGridRef: TEventDataGridRef<IWheelSchema> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОЙ КОЛЕСНОЙ СХЕМЫ В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}

export const useWheelSchemaViewModel = () => {

    const eventDataGridRef = useRef<TEventDataGridRef<IWheelSchema>>({...initEventDataGridRef})
    const dgRef = useRef<DataGrid<IWheelSchema, number> | null>(null);
    //#region BEHAVIOR GRID
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<IWheelSchema, number>> & NewRowInfo<IWheelSchema>)=>{

    },[]);
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])
    const onEditingStartCallback = useCallback((e: EditingStartEvent<IWheelSchema, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "РЕДАКТИРОВАНИЕ КОЛЕСНОЙ СХЕМЫ",
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