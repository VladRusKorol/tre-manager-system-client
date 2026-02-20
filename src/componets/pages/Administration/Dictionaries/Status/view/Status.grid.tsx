import { DataGrid } from "devextreme-react"
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { useCallback, type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { IStatus } from "../../../../../../interfaces/IStatus";

interface IProps {
    dataSource: DataSource<IStatus, number>,
    dgRef: RefObject<DataGrid<IStatus, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IStatus, number>> & NewRowInfo<IStatus>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IStatus, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IStatus, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}

const darkenColor = (hex: string, amount = 20) => {
    // Убираем # если он есть
    const color = hex.replace('#', '');

    // Парсим каналы
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Уменьшаем значения (не уходя ниже 0)
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);

    // Собираем обратно в HEX
    const toHex = (c: any) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


export const StatusGrid: React.FC<IProps>  = React.memo(({
    dataSource,
    dgRef,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
}) => {

    const StatusColorCell = useCallback((props: any) => {
        const color = props.data.value; 
        if (!color) return null;
        const borderColor = darkenColor(color, 40);
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    border: `3px solid ${borderColor}`,
                    //borderColor: borderColor,      // Тот же цвет...
                    //filter: 'brightness(0.8)' // ...но визуально всё (включая рамку) станет на 20% темнее
                }}/>
                    <span>{color}</span>
            </div>
        )
    },[dataSource]);
    



    return<>
        <DataGrid<IStatus,number>
            ref={dgRef}
            key={"idStatus"}
            dataSource={dataSource}    
            showBorders={true}
            focusedRowEnabled={true}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            showColumnHeaders={true}
            wordWrapEnabled={true}
    
            headerFilter={{allowSearch: true, width:350, height:700}}
            paging={{ enabled: false}}
            searchPanel={{visible: true, width: 300}}

            onEditCanceled={onEditingCancelCallback}
            onInitNewRow={onInitNewRowCallback}
            onRowInserted={onRowInsertedCallback}
            onEditingStart={onEditingStartCallback}
        >
            <Selection mode={"single"} />
                        
            <Scrolling useNative={true} mode={"virtual"} showScrollbar={"always"} />
            
            <Toolbar>
                <Item name={"addRowButton"}/>
                <Item name={"searchPanel"}/>
            </Toolbar>

            <Editing mode={"popup"} allowAdding={true} allowDeleting={true} allowUpdating={true}>
                <Popup showTitle={true} closeOnOutsideClick={true} titleRender={onTitleRenderCallback} onShown={onFormPopupShownCallback} width={"50%"} height={"50%"}/>
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"}  colCount={2}>
                    <SimpleItem 
                        dataField={"status"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название статуса"
                        }}
                    />
                    <SimpleItem 
                        dataField="statusColor" 
                        editorType="dxColorBox" // Тип редактора для выбора цвета
                        editorOptions={{
                            applyValueMode: 'instantly', // Применять цвет сразу при выборе
                            editAlphaChannel: false,     // Отключить прозрачность (если не нужна)
                        }}
                    />
                </Form>
            </Editing>


            <Column 
                dataField="idStatus" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="status" 
                caption="СТАТУС" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
            />

            <Column 
                dataField="statusColor" 
                dataType={"string"}
                caption="ЦВЕТ" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
                cellComponent={StatusColorCell}
            />

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={ (e: any) => e.row.data && (e.row.data as IStatus).countInTireStatusTrans===0 }
                />
            </Column>

        </DataGrid>
    </>
})