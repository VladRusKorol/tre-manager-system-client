import { DataGrid } from "devextreme-react"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button, Lookup } from "devextreme-react/data-grid";
import { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useCallback, type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { ITireModel} from "../../../../../../interfaces/ITireModel"
import type CustomStore from "devextreme/data/custom_store";

interface IProps {
    dataSource: DataSource<ITireModel, number>,
    tireBrandLookup: CustomStore<{ idTireBrand: number; name: string; }, any>,
    tireCarcasTypeLookup: CustomStore<{ idTireCarcasType: number; name: string; }, any>
    tireSeasonalityTypeLookup: CustomStore<{ idTireSeasonalityType: number; name: string; }, any> 
    tireSizeLookup: CustomStore<{ idTireSize: number; size: string; }, any> 
    dgRef: RefObject<DataGrid<ITireModel, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<ITireModel, number>> & NewRowInfo<ITireModel>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<ITireModel, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<ITireModel, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}

export const TireModelGrid: React.FC<IProps> = React.memo(({
    dataSource,
    dgRef,
    tireBrandLookup,
    tireCarcasTypeLookup,
    tireSeasonalityTypeLookup,
    tireSizeLookup,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
})=>{
    return<>
        <DataGrid<ITireModel,number>
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
                <Popup showTitle={true} closeOnOutsideClick={true} titleRender={onTitleRenderCallback} onShown={onFormPopupShownCallback} width={"70%"} height={"70%"}/>
                <Form showRequiredMark={true} requiredMessage={"Поле обязательно для заполнения"}  colCount={1} >
                    <SimpleItem 
                        dataField={"name"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название модели"
                        }}
                    />
                    <GroupItem colCount={2} caption={"нормативы".toUpperCase()}>
                        <SimpleItem 
                            dataField={"normalMiliage"} 
                            editorType={"dxNumberBox"} 
                            isRequired={true}
                            editorOptions={{
                                placeholder: "Введите норму пробега",
                                min: 1,             
                                showSpinButtons: true, // Показать стрелочки вверх/вниз для удобства
                                mode: "number",        // Подсказка для мобильных клавиатур
                                useLargeStep: false,   // Шаг изменения
                                step: 1000
                            }} 
                        />
                        <SimpleItem 
                            dataField={"minimalMiliage"} 
                            editorType={"dxNumberBox"} 
                            isRequired={true}
                            editorOptions={{
                                placeholder: "Введите минимальный пробег",
                                min: 1,             
                                showSpinButtons: true, // Показать стрелочки вверх/вниз для удобства
                                mode: "number",        // Подсказка для мобильных клавиатур
                                useLargeStep: false,   // Шаг изменения
                                step: 1000
                            }} 
                        />
                    </GroupItem>
                    <GroupItem colCount={2} caption={"описание".toUpperCase()}>
                        <SimpleItem dataField={"idTireBrand"} editorType={"dxSelectBox"} isRequired={true} />
                        <SimpleItem dataField={"idTireSize"} editorType={"dxSelectBox"} isRequired={true} />
                        <SimpleItem dataField={"idTireSeasonalityType"} editorType={"dxSelectBox"} isRequired={true} />
                        <SimpleItem dataField={"idTireCarcasType"} editorType={"dxSelectBox"} isRequired={true} />
                        <SimpleItem 
                            dataField={"protectorDepth"} 
                            editorType={"dxNumberBox"} 
                            isRequired={true}
                            editorOptions={{
                                placeholder: "Введите глубину протектора, мм",
                                min: 1,             
                                showSpinButtons: true, // Показать стрелочки вверх/вниз для удобства
                                mode: "number",        // Подсказка для мобильных клавиатур
                                useLargeStep: false,   // Шаг изменения
                            }} 
                        />
                    </GroupItem>
                </Form>
            </Editing>


            <Column 
                dataField="idTireModel" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
                allowSorting={true}
            />

            <Column 
                dataField="name" 
                caption="НАЗВАНИЕ" 
                minWidth={300} 
                allowFiltering={true}
                allowSorting={true}
                alignment={"left"}
            />    

            <Column dataField="idTireBrand" caption={"производитель".toUpperCase()} alignment={"left"}>
                <Lookup dataSource={tireBrandLookup} valueExpr="idTireBrand" displayExpr="name" />
            </Column>

            <Column caption={"пробег, км".toUpperCase()} alignment={"center"}>
                <Column 
                    dataField={"normalMiliage"} 
                    caption={"нормативный".toUpperCase()} 
                    alignment={"center"}
                    dataType={"number"} 
                    allowFiltering={true} 
                    allowSorting={true}
                    format="fixedPoint" 
                />
                
                <Column 
                    dataField={"minimalMiliage"} 
                    caption={"минимальный".toUpperCase()} 
                    alignment={"center"}
                    dataType={"number"} 
                    allowFiltering={true} 
                    allowSorting={true}
                    format="fixedPoint" 
                />
            </Column>

            <Column dataField="idTireSeasonalityType" caption={"сезонность".toUpperCase()} alignment={"left"}>
                <Lookup dataSource={tireSeasonalityTypeLookup} valueExpr="idTireSeasonalityType" displayExpr="name" />
            </Column>

            <Column dataField="idTireSize" caption={"размер".toUpperCase()} alignment={"left"}>
                <Lookup dataSource={tireSizeLookup} valueExpr="idTireSize" displayExpr="size" />
            </Column>

            <Column dataField="idTireCarcasType" caption={"каркас".toUpperCase()} alignment={"left"}>
                <Lookup dataSource={tireCarcasTypeLookup} valueExpr="idTireCarcasType" displayExpr="name" />
            </Column>

            <Column 
                dataField={"protectorDepth"} 
                caption={"глубина, мм".toUpperCase()} 
                alignment={"center"}
                dataType={"number"} 
                allowFiltering={true} 
                allowSorting={true}
                format="fixedPoint" 
            />

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={"120px"}>
                <Button name="edit" icon={"edit"} text={"ИЗМЕНИТЬ"}/>
                <Button 
                    name="delete" 
                    icon="trash" 
                    text="УДАЛИТЬ" 
                    visible={ (e: any) => e.row.data && (e.row.data as ITireModel).tires.length ===0 }
                />
            </Column>

        </DataGrid> 
    </>
})