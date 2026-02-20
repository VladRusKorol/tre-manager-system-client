import { DataGrid } from "devextreme-react"

import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button, Lookup } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { IBuilding } from "../../../../../../interfaces/IBuilding";
import type CustomStore from "devextreme/data/custom_store";

interface IProps {
    dataSource: DataSource<IBuilding, number>,
    dgRef: RefObject<DataGrid<IBuilding, number> | null>;
    buildingTypeLookups: CustomStore<{idBuildingType: number; name: string; }, any>
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IBuilding, number>> & NewRowInfo<IBuilding>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IBuilding, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IBuilding, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}

const canDeleteBuildingType = (rowData: IBuilding): boolean => {
    return !rowData.location || rowData.location.length === 0;
};


export const BuildingGrid: React.FC<IProps> = React.memo(({
    dataSource,
    dgRef,
    buildingTypeLookups,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
}) => {
    return<>
    <DataGrid<IBuilding,number>
        ref={dgRef}
        key={"idBuilding"}
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
                        placeholder: "Введите название оборудования"
                    }}
                />
                <SimpleItem dataField={"idBuildingType"} editorType={"dxSelectBox"} isRequired={true}/>
            </Form>
        </Editing>

        <Column 
            dataField="idBuilding" 
            caption="№" 
            width={70} 
            alignment="center" 
            sortIndex={0} 
            sortOrder="asc" 
            allowSorting={true}
        />

        <Column 
            dataField="name" 
            caption="НАИМЕНОВАНИЕ ЗДАНИЯ" 
            minWidth={300} 
            allowFiltering={true}
            allowSorting={true}
        />

        <Column dataField="idBuildingType" caption={"Тип Здания".toUpperCase()} width={400} dataType={"number"} >
            <Lookup dataSource={buildingTypeLookups} valueExpr="idBuildingType" displayExpr="name" />
        </Column>

        
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