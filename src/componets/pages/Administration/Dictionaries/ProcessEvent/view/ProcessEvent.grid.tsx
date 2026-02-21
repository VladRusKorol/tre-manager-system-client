import { DataGrid } from "devextreme-react"
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { IProcessEvent } from "../../../../../../interfaces/IProcessEvent";

interface IProps {
    dataSource: DataSource<IProcessEvent, number>,
    dgRef: RefObject<DataGrid<IProcessEvent, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IProcessEvent, number>> & NewRowInfo<IProcessEvent>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IProcessEvent, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IProcessEvent, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}


export const ProcessEventGrid: React.FC<IProps> = React.memo(({
    dataSource,
    dgRef,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
}) => {
    return<>
        <DataGrid<IProcessEvent,number>
            width={"100%"}
            height={"100%"}
            ref={dgRef}
            key={"idProcessEvent"}
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
                <Popup showTitle={true} closeOnOutsideClick={true} titleRender={onTitleRenderCallback} onShown={onFormPopupShownCallback} width={"50%"} height={"30%"}/>
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"}  colCount={1}>
                    <SimpleItem 
                        dataField={"processEventName"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название учетного процесса"
                        }}
                    />
                </Form>
            </Editing>

            <Column 
                dataField="idProcessEvent" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="processEventName" 
                caption="УЧЕТНЫЙ ПРОЦЕСС" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
            />

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={ (e: any) => e.row.data && (e.row.data as IProcessEvent).countInTireStatusTrans===0 }
                />
            </Column>

        </DataGrid>
    </>
})