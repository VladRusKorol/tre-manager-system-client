import { DataGrid } from "devextreme-react"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useCallback, type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { ITireSize} from "../../../../../../interfaces/ITireSize"

interface IProps {
    dataSource: DataSource<ITireSize, number>,
    dgRef: RefObject<DataGrid<ITireSize, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<ITireSize, number>> & NewRowInfo<ITireSize>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<ITireSize, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<ITireSize, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}

export const TireSizeGrid: React.FC<IProps> = React.memo(({
    dataSource,
    dgRef,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
})=>{
    return<>
        <DataGrid<ITireSize,number>
            ref={dgRef}
            key={"idTireSize"}
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
                <Popup showTitle={true} closeOnOutsideClick={true} titleRender={onTitleRenderCallback} onShown={onFormPopupShownCallback} width={"30%"} height={"50%"}/>
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"}  colCount={1}>
                    <SimpleItem 
                        dataField={"size"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название размера"
                        }}
                    />
                    <GroupItem colCount={3}>
                        <SimpleItem 
                            dataField={"profile"} 
                            editorType={"dxNumberBox"} 
                            isRequired={true}
                            editorOptions={{
                                placeholder: "Введите профиль",
                                min: 1,             
                                showSpinButtons: true, // Показать стрелочки вверх/вниз для удобства
                                mode: "number",        // Подсказка для мобильных клавиатур
                                useLargeStep: false,   // Шаг изменения
                               
                            }}
                            validationRules={[{ 
                                type: "range", 
                                min: 1, 
                                message: "Профиль должен быть больше нуля" 
                            }]}
                        />
                        <SimpleItem 
                            dataField={"diametr"} 
                            editorType={"dxNumberBox"} 
                            isRequired={true}
                            editorOptions={{
                                placeholder: "Введите диаметр",
                                min: 1,             
                                showSpinButtons: true, // Показать стрелочки вверх/вниз для удобства
                                mode: "number",        // Подсказка для мобильных клавиатур
                                useLargeStep: false,   // Шаг изменения
                               
                            }}
                            validationRules={[{ 
                                type: "range", 
                                min: 1, 
                                message: "Диаметр должен быть больше нуля" 
                            }]}
                        />
                        <SimpleItem 
                            dataField={"width"} 
                            editorType={"dxNumberBox"} 
                            isRequired={true}
                            editorOptions={{
                                placeholder: "Введите ширину",
                                min: 1,             
                                showSpinButtons: true, // Показать стрелочки вверх/вниз для удобства
                                mode: "number",        // Подсказка для мобильных клавиатур
                                useLargeStep: false,   // Шаг изменения
                               
                            }}
                            validationRules={[{ 
                                type: "range", 
                                min: 1, 
                                message: "Ширина должен быть больше нуля" 
                            }]}
                        />                       
                    </GroupItem>
                </Form>
            </Editing>


            <Column 
                dataField="idTireSize" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="size" 
                dataType={"string"}
                caption="РАЗМЕР" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
            />    

            <Column 
                dataField="profile" 
                caption="ПРОФИЛЬ, мм" 
                dataType={"number"}
                allowFiltering={true}
                allowSorting={true}
            />   
            <Column 
                dataField="diametr" 
                caption="ГЛУБИНА, мм" 
                dataType={"number"}
                allowFiltering={true}
                allowSorting={true}
            />   
            <Column 
                dataField="width" 
                caption="ШИРИНА, мм" 
                dataType={"number"}
                allowFiltering={true}
                allowSorting={true}
            />   

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={ (e: any) => e.row.data && (e.row.data as ITireSize).tireModels.length ===0 }
                />
            </Column>

        </DataGrid> 
    </>
})