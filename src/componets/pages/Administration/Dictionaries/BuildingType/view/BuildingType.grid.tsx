import { DataGrid } from "devextreme-react"
import type { IEquipmentType } from "../../../../../../interfaces/IEquipmentType"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { type JSX, type RefObject } from "react"
import type { IBuildingType } from "../../../../../../interfaces/IBuildingType"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";

interface IProps {
    dataSource: DataSource<IBuildingType, number>,
    dgRef: RefObject<DataGrid<IBuildingType, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IBuildingType, number>> & NewRowInfo<IBuildingType>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IBuildingType, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IBuildingType, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}


const canDeleteBuildingType = (rowData: IBuildingType): boolean => {
    return !rowData.buildings || rowData.buildings.length === 0;
};

export const BuildingTypeGrid: React.FC<IProps> = React.memo(({
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
        <DataGrid<IBuildingType,number>
            ref={dgRef}
            key={"idBuildingType"}
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
                dataField="idBuildingType" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="name" 
                caption="НАИМЕНОВАНИЕ ТИПА ЗДАНИЯ" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
            />

            <Column 
                dataField="buildings" 
                caption="КОЛИЧЕСТВО ПРИВЯЗАННЫХ ЗДАНИЙ К ТИПУ" 
                width={500}
                alignment="center"
                calculateDisplayValue={(rowData: IBuildingType) => {
                    return rowData.buildings ? rowData.buildings.length : 0;
                }}
                allowSorting={false}
            />

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={(e: any) => canDeleteBuildingType(e.row.data)}
                />
            </Column>

        </DataGrid>
    </>
})
