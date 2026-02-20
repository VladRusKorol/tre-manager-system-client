import type { DataGrid } from "devextreme-react"
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType"
import { useCallback, useRef } from "react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";

export type TEventDataGridRef<T> = {
    event: 'new' | 'edit',
    popupTitle: string | null,
    popupTitleEditName: string | null
}

const initEventDataGridRef: TEventDataGridRef<IEquipmentType> = {
    event: "new",
    popupTitle: "СОЗДАНИЕ НОВОГО ТИПА ОБОРУДОВАНИЯ В СИСТЕМЕ УЧЕТА КГШ",
    popupTitleEditName: null
}

export const useEquipmentTypeViewModel = () => {

    const eventDataGridRef = useRef<TEventDataGridRef<IEquipmentType>>({...initEventDataGridRef})

    const dgRef = useRef<DataGrid<IEquipmentType, number> | null>(null);

    //#region ACTION BEHAVIOR CRUD DATAGRID
    /**
     * КОМУ: Для свойства DataGrid.onEditCanceling
     * КОГДА: Событие onEditCanceling (или его последствия) срабатывает, когда пользователь выходит из режима редактирования без сохранения изменений.
        СЦЕНАРИИ:
        1) Нажатие кнопки «Отмена» (Cancel): В окне редактирования (Popup) или в строке (Row/Batch mode).
        2) Клавиша Esc: Если фокус находится в форме редактирования.
        3) Клик вне формы: Если выбран режим mode: 'batch' или mode: 'cell', и пользователь кликнул на другую ячейку или область, не сохранив текущую.
       ДЛЯ ЧЕГО: обнуляем title чтобы отображалось как новый тип оборудования 
     */
    const onEditingCancelCallback = useCallback(()=>{
        eventDataGridRef.current = {...initEventDataGridRef}
    },[])

    /**
     * КОМУ: Для свойства DataGrid.onInitNewRow
     * КОГДА: Событие onInitNewRow выполняется в тот момент, когда пользователь нажал кнопку «Добавить» (+), но форма создания еще только открывается
     * ДЛЯ ЧЕГО: если надо дообогаить данные которые отобразятся, хранятся в e, 
     */
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<IEquipmentType, number>> & NewRowInfo<IEquipmentType>)=>{

    },[]);

    /**
     * КОМУ: Для свойства DataGrid.onRowInserted
     * КОГДА: Событие onRowInserted выполняется в тот момент, добавление записи произошло и popup пошел на закрытие
     * ДЛЯ ЧЕГО: обнуляем title чтобы отображалось как новый тип оборудования 
     */
    const onRowInsertedCallback = useCallback(()=>{
        onEditingCancelCallback()
    },[])

    /**
     * КОМУ: Для свойства DataGrid.onEditiingStart
     * КОГДА: Событие onEditiingStart выполняется в тот момент, когда пользователь нажал кнопку Редактирования (+), но форма создания еще только открывается
     * ДЛЯ ЧЕГО: обновляем title чтобы отображалось как текущий тип оборудования 
     */
    const onEditingStartCallback = useCallback((e: EditingStartEvent<IEquipmentType, number>)=> {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "Редактирование типа оборудования",
            popupTitleEditName: e.data.name as string
        }
    },[])

    //#endregion

    //#region ACTION кнопок TOOLBAR DATA GRID
    const onFilterSwitchCallback = useCallback(()=>{
        const isVisible: boolean = dgRef.current?.instance.option('headerFilter.visible') as boolean;
        if(isVisible){
            dgRef.current?.instance.clearFilter();
        }
        dgRef.current?.instance.option('headerFilter.visible', !isVisible)
    },[])
    //#endregion

    

    return {
        dgRef,
        eventDataGridRef,

        onFilterSwitchCallback,

        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback
    }
}
