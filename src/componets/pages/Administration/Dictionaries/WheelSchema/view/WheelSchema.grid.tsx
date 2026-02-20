import { DataGrid } from "devextreme-react"
import type { IWheelSchema } from "../../../../../../interfaces/IWheelSchema"
import type DataSource from "devextreme/data/data_source";
import { Column, Button, Scrolling, Selection, Toolbar, Item, Editing, Popup, Form, Lookup} from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { useEffect, type JSX } from "react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type CustomStore from "devextreme/data/custom_store";

interface IProps {
    masterDataSource: DataSource<IWheelSchema, any>,
    detailDataSource: DataSource<{
        idWheelSchemaPosition: number;
        idWheelSchema: number;
        idTirePosition: number;
    }, number>
    tirePositionLoockUp: CustomStore<{ idTirePosition: number; name: string; }, any>
    selectedRowKey: number
    setSelectedRowKey: React.Dispatch<React.SetStateAction<number>>
    dgRef: React.RefObject<DataGrid<IWheelSchema, number> | null>,
    onEditingCancelCallback: () => void,
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IWheelSchema, number>> & NewRowInfo<IWheelSchema>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IWheelSchema, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IWheelSchema, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
}

const canDeleteWheelSchema = (rowData: IWheelSchema): boolean => {
    return !rowData.equipmentModels || rowData.equipmentModels.length === 0;
};


const WheelSchemaGrid : React.FC<IProps> = ({
    masterDataSource,
    detailDataSource,
    tirePositionLoockUp,
    selectedRowKey,
    setSelectedRowKey,
    dgRef,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback
}) => {

    useEffect(()=>{
        //console.log(selectedRowKey)
        console.log(detailDataSource)
    },[detailDataSource,selectedRowKey])

    return <div className="h-box" style={{justifyContent: "space-around"}}>
        <DataGrid<IWheelSchema,number>
            ref={dgRef}
            keyExpr={"idWheelSchema"}
            width={"48%"}
            height={"100%"}
            dataSource={masterDataSource}    
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
            onSelectionChanged={(e)=>{
                const key = e.selectedRowsData[0].idWheelSchema ?? 0;
                setSelectedRowKey(key)
            }}

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
                        dataField={"name"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название новой колесной схемы"
                        }}
                    />
                </Form>
            </Editing>

            <Column 
                dataField="idWheelSchema" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="name" 
                caption="НАИМЕНОВАНИЕ КОЛЕСНОЙ СХЕМЫ" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
            />

            <Column 
                dataField="equipmentModels" 
                caption="КОЛ-ВО МОДЕЛЕЙ ОБОРУДОВАНИЯ" 
                alignment="center"
                calculateDisplayValue={(rowData: IWheelSchema) => {
                    return rowData.equipmentModels ? rowData.equipmentModels.length : 0;
                }}
                allowSorting={false}
            />

            <Column 
                dataField="wheelSchemaPosition" 
                caption="КОЛ-ВО ПРИВЯЗАННЫХ ПОЗИЦИЙ" 
                alignment="center"
                calculateDisplayValue={(rowData: IWheelSchema) => {
                    return rowData.wheelSchemaPosition ? rowData.wheelSchemaPosition.length : 0;
                }}
                allowSorting={false}
            />

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={(e: any) => canDeleteWheelSchema(e.row.data)}
                />
            </Column>


        </DataGrid>

        <DataGrid<{ idWheelSchemaPosition: number; idWheelSchema: number; idTirePosition: number; }, number>
            width={"48%"}
            keyExpr="idWheelSchemaPosition" 
            dataSource={detailDataSource}
            height={"100%"} 
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
        >
            <Editing 
                mode={"batch"} 
                allowAdding={true} 
                allowDeleting={true} 
                selectTextOnEditStart={true}
                startEditAction="click"
            />

            <Column 
                dataField="idWheelSchemaPosition" 
                alignment="left" 
                visible={false}
            />

            <Column 
                dataField="idTirePosition" 
                caption={"к текущей колесной схеме привязаны следущие позиции".toUpperCase()} 
                alignment="left" 
                allowSorting={"asc"}
            >
                <Lookup dataSource={tirePositionLoockUp} displayExpr={"name"} valueExpr={"idTirePosition"}/>
            </Column>

            <Toolbar>
                <Item name="addRowButton" />
                <Item name="saveButton" />
                <Item name="revertButton" />
             </Toolbar>
        </DataGrid>
    </div>
}


export const WheelSchemaGridMemo = React.memo(WheelSchemaGrid); 