import { Button, DataGrid } from "devextreme-react";
import type DataSource from "devextreme/data/data_source";
import { 
    Column, 
    Lookup, 
    Editing, 
    Popup, 
    Form, 
    Toolbar, 
    Item, 
    Selection, 
    Scrolling,
    Button as DGButton
} from "devextreme-react/data-grid";
import { SimpleItem } from "devextreme-react/form";
import type CustomStore from "devextreme/data/custom_store";
import type { ILocation } from "../../../../../../interfaces/ILocation";
import type { ILocationType } from "../../../../../../interfaces/ILocationType";
import type { JSX, RefObject } from "react";
import type { EventInfo } from "devextreme/events";
import type dxDataGrid from "devextreme/ui/data_grid";
import type { EditingStartEvent, NewRowInfo, RowInsertedEvent } from "devextreme/ui/data_grid";

interface ILocationsGrid {
    dataSource: DataSource<ILocation, any>;
    dgRef: RefObject<DataGrid<ILocation, number> | null>;
    
    // Справочники
    locationTypesLoockUp: CustomStore<ILocationType, any>;
    equipmentsLoockUp: CustomStore<{ idEquipment: number; name: string; }, any>;
    buildingsLoockUp: CustomStore<{ idBuilding: number; name: string; }, any>;

    // Коллбеки жизненного цикла
    onEditingCancelCallback: () => void;
    onInitNewRowCallback: (e: EventInfo<dxDataGrid<ILocation, number>> & NewRowInfo<ILocation>) => void;
    onRowInsertedCallback: (e: RowInsertedEvent<ILocation, number>) => void;
    onEditingStartCallback: (e: EditingStartEvent<ILocation, number>) => void;
    onTitleRenderCallback: () => JSX.Element | undefined;
    onFormPopupShownCallback: (e: any) => void;
    onFilterSwitchCallback: () => void;
    openCreateLocationPopup: () => void;
    openUpdateLoccationPopup: (key: number) => void
}

export const LocationsGrid: React.FC<ILocationsGrid> = ({ 
    dataSource, 
    dgRef,
    locationTypesLoockUp, 
    equipmentsLoockUp,
    buildingsLoockUp,
    onEditingCancelCallback,
    onInitNewRowCallback,
    onRowInsertedCallback,
    onEditingStartCallback,
    onTitleRenderCallback,
    onFormPopupShownCallback,
    onFilterSwitchCallback,
    openCreateLocationPopup,
    openUpdateLoccationPopup
}) => {

    return (
        <DataGrid<ILocation, number>
            ref={dgRef}
            key={"idLocation"}
            dataSource={dataSource}    
            showBorders={true}
            focusedRowEnabled={true}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            showColumnHeaders={true}
            wordWrapEnabled={true}
            
            headerFilter={{ allowSearch: true, width: 350, height: 700 }}
            paging={{ enabled: false }}
            searchPanel={{ visible: true, width: 300 }}

            // Привязка событий
            onEditCanceled={onEditingCancelCallback}
            onInitNewRow={onInitNewRowCallback}
            onRowInserted={onRowInsertedCallback}
            onEditingStart={onEditingStartCallback}
        >
            <Selection mode={"single"} />
            <Scrolling useNative={true} mode={"virtual"} showScrollbar={"always"} />

            <Toolbar>
                <Item location="after">
                    <Button
                        icon="add"
                        hint="Создать запись"
                        onClick={openCreateLocationPopup}
                    />
                </Item>
                <Item location="after">
                    <Button
                        icon="filter"
                        hint="Переключить фильтры"
                        onClick={onFilterSwitchCallback}
                    />
                </Item>
                <Item name={"searchPanel"} />
            </Toolbar>

            <Editing 
                mode={"popup"} 
                allowAdding={true} 
                allowDeleting={true} 
                allowUpdating={true}
                useIcons={true}

            >
                <Popup 
                    showTitle={true} 
                    closeOnOutsideClick={true} 
                    titleRender={onTitleRenderCallback} 
                    onShown={onFormPopupShownCallback}
                    width={"80%"}
                />
                <Form showRequiredMark={true} width={"100%"} colCount={1}>
                    <SimpleItem 
                        dataField={"displayName"} 
                        editorType={"dxTextBox"} 
                        isRequired={true}
                        editorOptions={{ placeholder: "Введите наименование локации" }}
                    />
                    <SimpleItem 
                        dataField={"idLocationType"} 
                        editorType={"dxSelectBox"} 
                        isRequired={true}
                        label={{ text: "Тип локации" }}
                    />
                    <SimpleItem 
                        dataField={"idEquipment"} 
                        editorType={"dxSelectBox"} 
                        label={{ text: "Привязанное оборудование" }}
                    />
                    <SimpleItem 
                        dataField={"idBuilding"} 
                        editorType={"dxSelectBox"} 
                        label={{ text: "Здание" }}
                    />
                </Form>
            </Editing>

            {/* Колонки */}
            <Column 
                dataField="idLocation" 
                caption="№" 
                width={70} 
                alignment="center" 
                sortIndex={0} 
                sortOrder="asc" 
            />

            <Column 
                dataField="displayName" 
                caption="НАИМЕНОВАНИЕ ЛОКАЦИИ" 
                minWidth={200} 
                allowFiltering={true} 
            />

            <Column dataField="idLocationType" caption="ТИП ЛОКАЦИИ" width={200}>
                <Lookup 
                    dataSource={locationTypesLoockUp} 
                    valueExpr="idLocationType" 
                    displayExpr="name" 
                />
            </Column>

            <Column dataField="idEquipment" caption="ОБОРУДОВАНИЕ" minWidth={150}>
                <Lookup 
                    dataSource={equipmentsLoockUp} 
                    valueExpr="idEquipment" 
                    displayExpr="name" 
                />
            </Column>

            <Column dataField="idBuilding" caption="ЗДАНИЕ" minWidth={150}>
                <Lookup 
                    dataSource={buildingsLoockUp} 
                    valueExpr="idBuilding" 
                    displayExpr="name" 
                />
            </Column>

            <Column type={"buttons"} caption={"ДЕЙСТВИЯ"} width={110}>
                <DGButton icon="edit" onClick={(e: any)=> {
                    return e.row.data.idLocation && openUpdateLoccationPopup(e.row.data.idLocation)
                }}/>
                <DGButton name="delete" icon="trash" />
            </Column>

        </DataGrid>
    );
};