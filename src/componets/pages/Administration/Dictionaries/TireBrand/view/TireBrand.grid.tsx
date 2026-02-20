import { DataGrid } from "devextreme-react"
import { Column, Editing, Form, Item, Popup, Scrolling, Selection, Toolbar, Button } from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import React, { useCallback, type JSX, type RefObject } from "react"
import type DataSource from "devextreme/data/data_source";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";
import type { EventInfo } from "devextreme/events";
import type { ITireBrand} from "../../../../../../interfaces/ITireBrand"

interface IProps {
    dataSource: DataSource<ITireBrand, number>,
    dgRef: RefObject<DataGrid<ITireBrand, number> | null>;
    
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<ITireBrand, number>> & NewRowInfo<ITireBrand>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<ITireBrand, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<ITireBrand, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined
    onFormPopupShownCallback: (e: any) => void
    //onFilterSwitchCallback: () => void
}

export const TireBrandGrid: React.FC<IProps> = React.memo(({
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
        <DataGrid<ITireBrand,number>
            ref={dgRef}
            key={"idTireBrand"}
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
                        dataField={"name"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{
                            placeholder: "Введите название бренда"
                        }}
                    />
                    <SimpleItem 
                        dataField="comment" 
                        editorType="dxTextArea" 
                        label={{ text: "Комментарий" }}
                        isRequired={false}
                        editorOptions={{
                            height: 120, 
                            autoResizeEnabled: true, 
                            placeholder: "Введите описание бренда...",
                            stylingMode: "outlined",
                            spellcheck: true 
                        }}
                    />
                </Form>
            </Editing>


            <Column 
                dataField="idTireBrand" 
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
            />    

            <Column 
                dataField="comment" 
                caption="КОММЕНТАРИИ" 
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
                    visible={ (e: any) => e.row.data && (e.row.data as ITireBrand).tireModels.length ===0 }
                />
            </Column>

        </DataGrid> 
    </>
})