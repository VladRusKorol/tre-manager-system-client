import { DataGrid } from "devextreme-react"
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType"
import type DataSource from "devextreme/data/data_source"
import type CustomStore from "devextreme/data/custom_store";
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import type { JSX, RefObject } from "react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";

interface IEquipmentTypeGrid {
    dataSource: DataSource<IEquipmentType, any>,
    dgRef: RefObject<DataGrid<IEquipmentType, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IEquipmentType, number>> & NewRowInfo<IEquipmentType>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IEquipmentType, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IEquipmentType, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    onFilterSwitchCallback: () => void
}

const canDeleteEquipmentType = (rowData: IEquipmentType): boolean => {
    return !rowData.equipments || rowData.equipments.length === 0;
};

export const EquipmentTypeGrid: React.FC<IEquipmentTypeGrid> = ({
    dataSource,
    dgRef,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
    onFilterSwitchCallback
}) => {



    return<> 
        <DataGrid<IEquipmentType,number>
            ref={dgRef}
            key={"idEquipmentType"}
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
                <Popup showTitle={true} closeOnOutsideClick={true} titleRender={onTitleRenderCallback} onShown={onFormPopupShownCallback} width={"30%"} height={"30%"}/>
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"}  colCount={1}>
                    <SimpleItem 
                        dataField={"name"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название типа оборудования"
                        }}
                    />
                </Form>
            </Editing>

            <Column 
                dataField="idEquipmentType" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="name" 
                caption="НАИМЕНОВАНИЕ ТИПА ОБОРУДОВАНИЯ" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
            />

            <Column 
                dataField="equipments" 
                caption="КОЛИЧЕСТВО ПРИВЯЗАННЫХ ОБОРУДОВАНИЙ" 
                width={500}
                alignment="center"
                calculateDisplayValue={(rowData: IEquipmentType) => {
                    return rowData.equipments ? rowData.equipments.length : 0;
                }}
                allowSorting={false}
            />

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={(e: any) => canDeleteEquipmentType(e.row.data)}
                />
            </Column>

        </DataGrid>
    </>
}