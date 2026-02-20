
import type { IEquipmentModel } from "../../../../../../interfaces/IEquipmentModel"
import { DataGrid,  } from "devextreme-react"
import type { IWheelSchema } from "../../../../../../interfaces/IWheelSchema"
import type DataSource from "devextreme/data/data_source";
import { Column, Button, Lookup, Scrolling, Selection, Toolbar, Item, Editing, Popup, Form} from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { useEffect, type JSX } from "react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type CustomStore from "devextreme/data/custom_store";


interface IProps {
    dataSource: DataSource<IEquipmentModel, any>,
    wheelSchemaLookUp: CustomStore<{ idWheelSchema: number; name: string; }, any>
    dgRef: React.RefObject<DataGrid<IEquipmentModel, number> | null>,
    onEditingCancelCallback: () => void,
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<IEquipmentModel, number>> & NewRowInfo<IEquipmentModel>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<IEquipmentModel, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<IEquipmentModel, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
}

const canDeleteEquipmentType = (rowData: IEquipmentModel): boolean => {
    return !rowData.equipments || rowData.equipments.length === 0;
};


const EquipmentModelGrid: React.FC<IProps> = ({
    dataSource,
    wheelSchemaLookUp,
    dgRef,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback
}) => {


    return <DataGrid<IEquipmentModel,number>
        ref={dgRef}
        key={"idEquipmentModel"}
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
                    dataField={"name"} 
                    editorType={"dxTextBox"} 
                    isRequired={true}
                    editorOptions={{
                        placeholder: "Введите название новой колесной схемы"
                    }}
                />
                <SimpleItem dataField={"idWheelSchema"} editorType={"dxSelectBox"} isRequired={true} />
            </Form>
        </Editing>

        <Column dataField="idEquipmentModel" caption="№" width={70} alignment="center" sortIndex={0} sortOrder="asc" allowSorting={true}/>

        <Column dataField="name" caption="НАИМЕНОВАНИЕ МОДЕЛИ ОБОРУДОВАНИЯ" minWidth={200} allowFiltering={true}/>

        <Column dataField="idWheelSchema" caption={"КОЛЕСНая схема".toUpperCase()} width={400} dataType={"number"} >
            <Lookup dataSource={wheelSchemaLookUp} valueExpr="idWheelSchema" displayExpr="name" />
        </Column>

        <Column 
            dataField="equipments" 
            caption="КОЛИЧЕСТВО ПРИВЯЗАННЫХ ОБОРУДОВАНИЙ" 
            width={500}
            alignment="center"
            calculateDisplayValue={(rowData: IEquipmentModel) => {
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
}

export const EquipmentModelGridMemo = React.memo(EquipmentModelGrid) 