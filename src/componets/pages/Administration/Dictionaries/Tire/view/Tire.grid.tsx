import { DataGrid, Button } from "devextreme-react"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar,     Button as DGButton, Lookup } from "devextreme-react/data-grid";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useCallback, type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { ITire} from "../../../../../../interfaces/ITire"
import type CustomStore from "devextreme/data/custom_store";

interface IProps {
    dataSource: DataSource<ITire, number>,
    tireModelLookup: CustomStore<{ idTireModel: number; name: string; }, any>
    dgRef: RefObject<DataGrid<ITire, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<ITire, number>> & NewRowInfo<ITire>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<ITire, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<ITire, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    openUpdateTirePopup: (key: number) => void
    
}

export const TireGrid: React.FC<IProps> = React.memo(({
    dataSource,
    dgRef,
    tireModelLookup, 
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
    openUpdateTirePopup
})=>{
    return<>
        <DataGrid<ITire,number>
            ref={dgRef}
            key={"idTireModel"}
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
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"}  colCount={2} >
                    <SimpleItem 
                        dataField={"serialNumber"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите серийный номер автошины"
                        }}
                    />
                    <SimpleItem dataField={"idTireModel"} editorType={"dxSelectBox"} isRequired={true} editorOptions={{
                        placeholder: "Укажите модель"
                    }}/>

                    <SimpleItem dataField={"entrySystemData"} editorType={"dxDateBox"} isRequired={true} editorOptions={{
                        placeholder: "Укажите дату ввода"
                    }}/>

                    <SimpleItem dataField={"entrySystemMiliage"} editorType={"dxNumberBox"} isRequired={true} editorOptions={{
                        placeholder: "Укажите пробег на дату ввода"
                    }}/>
                </Form>
            </Editing>


            <Column 
                dataField="idTire" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />
            <Column cssClass={"custom-boolean-column"} dataField={"isActive"} caption={"АКТИВНЫЙ"} alignment={"center"} dataType={"boolean"} width={"100px"}/>
            <Column 
                dataField="serialNumber" 
                caption="СЕРИЙНЫЙ НОМЕР" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
                alignment={"left"}
            />    

            <Column dataField="idTireModel" caption={"Модель".toUpperCase()} alignment={"left"}>
                <Lookup dataSource={tireModelLookup} valueExpr="idTireModel" displayExpr="name" />
            </Column>

            <Column caption={"ДАТА"} alignment={"center"}>
                <Column 
                    dataField="entrySystemData" 
                    dataType={"date"}
                    caption="ВВОД"  
                    allowFiltering={true}
                    allowSorting={true}
                    alignment={"center"}
                />    
                
                <Column 
                    dataField="disposalDate" 
                    dataType={"date"}
                    caption="ВЫВОД"  
                    allowFiltering={true}
                    allowSorting={true}
                    alignment={"center"}
                />   
            </Column>

            <Column caption={"ПРОБЕГ"} alignment={"center"}>
                <Column 
                    dataField="entrySystemMiliage" 
                    dataType={"number"}
                    format={"fixedPoint"}
                    caption="ПРИ ВВОДЕ В СИСТЕМУ, КМ"  
                    allowFiltering={true}
                    allowSorting={true}
                    alignment={"center"}
                />  
                <Column 
                    dataField="currentMiliage" 
                    dataType={"number"}
                    format={"fixedPoint"}
                    caption="ТЕКУЩИЙ В СИСТЕМЕ, КМ"  
                    allowFiltering={true}
                    allowSorting={true}
                    alignment={"center"}
                />  
            </Column>  





            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                {/* <DGButton name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"} /> */}
                <DGButton icon="edit" onClick={(e: any)=> {
                    return e.row.data.idTire && openUpdateTirePopup(e.row.data.idTire)
                }}/>
            </Column>

        </DataGrid> 
    </>
})