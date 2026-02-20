import { DataGrid } from "devextreme-react"
import type { IEquipment } from "../../../../../../interfaces/IEquipment"
import type DataSource from "devextreme/data/data_source"
import type CustomStore from "devextreme/data/custom_store";
import { Column, Editing, Form, Item, Lookup, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import type { JSX, RefObject } from "react";
import type { TEventDataGridRef } from "../viewmodel/useEquipmentViewModel";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";

interface IEquipmentGrid {
    dataSource: DataSource<IEquipment, any>,
    EquipmentTypesLoockUp: CustomStore<{
        idEquipmentType: number;
        name: string;
    }, any>,
    EquipmentModelsLoockUp: CustomStore<{
        idEquipmentModel: number;
        name: string;
    }, any>

    dgRef: RefObject<DataGrid<IEquipment, number> | null>;
    
    // Коллбэки
    onFilterSwitchCallback: () => void;
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IEquipment, number>> & NewRowInfo<IEquipment>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IEquipment, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IEquipment, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
}

export const EquipmentGrid: React.FC<IEquipmentGrid> = ({
    dataSource,
    EquipmentTypesLoockUp,
    EquipmentModelsLoockUp,

    dgRef,
    onFilterSwitchCallback,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback
}) => {

    return<> 
        <DataGrid<IEquipment,number>
            ref={dgRef}
            key={"idEquipment"}
            dataSource={dataSource}    
            showBorders={true}
            focusedRowEnabled={true}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            showColumnHeaders={true}
            wordWrapEnabled={true}
            repaintChangesOnly={false}
    
            headerFilter={{allowSearch: true, width:350, height:700, }}
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
                <Item widget={"dxButton"} options={{icon: "filter", hint: "Расширенная фильтрация", onClick: onFilterSwitchCallback}}/>
                <Item name={"addRowButton"}/>
                <Item name={"searchPanel"}/>
            </Toolbar>

            <Editing mode={"popup"} allowAdding={true} allowDeleting={true} allowUpdating={true}>

                <Popup showTitle={true} closeOnOutsideClick={true} titleRender={onTitleRenderCallback} onShown={onFormPopupShownCallback} width={"50%"} height={"50%"}/>
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"} width={"100%"} colCount={1}>
                    <SimpleItem dataField={"name"} editorType={"dxTextBox"} isRequired={true}/>
                    <GroupItem  colCount={2}>
                        <SimpleItem dataField={"idEquipmentType"} editorType={"dxSelectBox"} isRequired={true} />
                        <SimpleItem dataField={"idEquipmentModel"} editorType={"dxSelectBox"} isRequired={true}/>
                    </GroupItem>
                </Form>

            </Editing>

            <Column dataField="idEquipment" caption="№" width={70} alignment="center" sortIndex={0} sortOrder="asc" allowSorting={true}/>

            <Column dataField="name" caption="НАИМЕНОВАНИЕ ОБОРУДОВАНИЯ" minWidth={200} allowFiltering={true}/>

            <Column dataField="idEquipmentType" caption={"Тип оборудования".toUpperCase()} width={400} dataType={"number"} >
                <Lookup dataSource={EquipmentTypesLoockUp} valueExpr="idEquipmentType" displayExpr="name" />
            </Column>

            <Column dataField="idEquipmentModel" caption={"Модель".toUpperCase()} width={400} >
                <Lookup dataSource={EquipmentModelsLoockUp} valueExpr="idEquipmentModel" displayExpr="name" />
            </Column>

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"100px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button name="delete" icon="trash" text="УДАЛИТЬ" visible={(e: any)=> e.row.data  && (e.row.data.locations as Array<{idLocation: number}>).length == 0 ? true : false}/>
            </Column>

        </DataGrid>
    </>
}