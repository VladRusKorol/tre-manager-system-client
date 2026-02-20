import type { ILocation } from "../../../../../../interfaces/ILocation"; // Путь к вашему интерфейсу
import { useCallback, useRef, useState } from "react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo } from "devextreme/ui/data_grid";
import type { DataGrid } from "devextreme-react";

export type TEventDataGridRef<T> = {
    event: 'new' | 'edit',
    popupTitle: string | null,
    popupTitleEditName: string | null
}

// Начальное состояние для управления заголовками и поведением формы
const initEventDataGridRef: TEventDataGridRef<ILocation> = {
    event: "new",
    popupTitle: "РЕГИСТРАЦИЯ НОВОЙ ЛОКАЦИИ В СИСТЕМЕ",
    popupTitleEditName: null
}

export const useLocationViewModel = () => {
   
    const eventDataGridRef = useRef<TEventDataGridRef<ILocation>>({ ...initEventDataGridRef });

    const dgRef = useRef<DataGrid<ILocation, number> | null>(null);

    //#region ACTION BEHAVIOR CRUD DATAGRID
    
    /**
     * Сброс метаданных при отмене редактирования или закрытии формы
     */
    const onEditingCancelCallback = useCallback(() => {
        eventDataGridRef.current = { ...initEventDataGridRef };
    }, []);

    /**
     * Инициализация новой строки локации
     */
    const onInitNewRowCallback = useCallback((e: EventInfo<dxDataGrid<ILocation, number>> & NewRowInfo<ILocation>) => {
        // Здесь можно предзаполнить поля, например:
        // e.data.idLocationType = 1; 
        eventDataGridRef.current = { ...initEventDataGridRef };
    }, []);

    /**
     * Срабатывает после успешной вставки строки
     */
    const onRowInsertedCallback = useCallback(() => {
        onEditingCancelCallback();
    }, [onEditingCancelCallback]);

    /**
     * Настройка заголовков при входе в режим редактирования локации
     */
    const onEditingStartCallback = useCallback((e: EditingStartEvent<ILocation, number>) => {
        eventDataGridRef.current = {
            ...eventDataGridRef.current,
            event: "edit",
            popupTitle: "Редактирование параметров локации",
            popupTitleEditName: e.data.displayName as string // Для локаций используем displayName
        };
    }, []);

    //#endregion

    //#region ACTION кнопок TOOLBAR DATA GRID
    
    /**
     * Переключение видимости фильтров в заголовках колонок
     */
    const onFilterSwitchCallback = useCallback(() => {
        const isVisible: boolean = dgRef.current?.instance.option('headerFilter.visible') as boolean;
        if (isVisible) {
            dgRef.current?.instance.clearFilter();
        }
        dgRef.current?.instance.option('headerFilter.visible', !isVisible);
    }, []);
    
    //#endregion

    //#region Все что связано с открытим POPUP для добавления записи локации
    const [isVisibleCreatePopup, setIsVisibleCreatePopup] = useState<boolean>(false)
    const [updateKey, setUpdateKey] = useState<number|null>(null);
    
    const openCreateLocationPopup = useCallback(()=> {
        setIsVisibleCreatePopup(true)
        setUpdateKey(null)
    },[])

    const openUpdateLoccationPopup = useCallback((key: number)=> {
        setIsVisibleCreatePopup(true)
        setUpdateKey(key)
    },[])

    const closeCreateLocationPopup = useCallback(()=> {
        setIsVisibleCreatePopup(false)
        setUpdateKey(null)
    },[])

    //#endregion
    return {
        dgRef,
        eventDataGridRef,

        onFilterSwitchCallback,

        onEditingCancelCallback,
        onInitNewRowCallback,
        onRowInsertedCallback,
        onEditingStartCallback,

        isVisibleCreatePopup,
        openCreateLocationPopup,
        openUpdateLoccationPopup,
        closeCreateLocationPopup,
        updateKey
    };
};