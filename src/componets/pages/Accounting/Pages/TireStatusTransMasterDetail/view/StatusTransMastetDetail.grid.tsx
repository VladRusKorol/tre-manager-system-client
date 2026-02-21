import { DataGrid } from "devextreme-react"
import { Column, Format, Lookup } from "devextreme-react/data-grid"
import type DataSource from "devextreme/data/data_source"
import type { ITireStatusTrans } from "../../../../../../interfaces/ITireStatusTrans"
import type CustomStore from "devextreme/data/custom_store";
import type { CellPreparedEvent } from "devextreme/ui/data_grid";
import { useCallback } from "react";
import { apiClient } from "../../../../../../api/ApiClient";
import { gql } from "@apollo/client";

interface IProps {
    dataSource: DataSource<ITireStatusTrans, number>;
    locationLookup: CustomStore<{ idLocation: number; displayName: string;}, any>;
    statusLookup: CustomStore<{ idStatus: number; status: string; }, any>;
    tirePositionLookup: CustomStore<{ idTirePosition: number; name: string; }, any>;
    processEventLookup: CustomStore<{ idProcessEvent: number; processEventNam: string; }, any>;
}

export const StatusTransMastetDetailGrid: React.FC<IProps>  = ({
    dataSource, locationLookup, statusLookup, tirePositionLookup, processEventLookup
}) => {

    const getColorByIdStatus = useCallback(async (idStatus: number) => {
        const color: { statusById: { statusColor: string } } | undefined = await apiClient.queryWithVars<{ statusById: { statusColor: string } }>(gql`
            query StatusById($ident: Int!) {
                statusById(ident: $ident) {
                    statusColor
                }
            }
        `,{ ident: idStatus })
        return color?.statusById.statusColor ?? 'white'
    },[statusLookup])

    return <>
        <DataGrid
            width={"100%"}
            dataSource={dataSource}
            showBorders={true}
            focusedRowEnabled={false}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            showColumnHeaders={true}
            wordWrapEnabled={true}
            // height={200}
            onCellPrepared={ async (e: CellPreparedEvent<ITireStatusTrans, number>) =>{
                console.log(e)
                e.cellElement.style.fontSize = "12px"
                if(e.rowType === "header"){ 
                    e.cellElement.style.padding = "0px"
                    e.cellElement.style.border = "0.5px solid grey"
                    e.cellElement.style.verticalAlign = "middle"
                    e.cellElement.style.textAlign = "center"
                    e.cellElement.style.backgroundColor = "lightblue"
                    e.cellElement.style.fontSize = "14px"
                }
                if(e.rowType === 'data') {
                    const c = await getColorByIdStatus(e.data.idStatus)
                    e.cellElement.style.backgroundColor = c; 
                }
                
            }}
        >
            <Column 
                dataField="idLocation"
                caption="Локация"
                dataType="number"
                width={200}
            >
                <Lookup 
                    dataSource={{
                        store: locationLookup
                    }}
                    displayExpr="displayName"
                    valueExpr="idLocation"
                />
            </Column>
            
            <Column 
                dataField="idStatus"
                caption="Статус"
                dataType="number"
                width={150}
            >
                <Lookup 
                    dataSource={statusLookup}
                    displayExpr="status"
                    valueExpr="idStatus"
                />
            </Column>
            
            <Column 
                dataField="idTirePosition"
                caption="Позиция"
                dataType="number"
                width={150}
            >
                <Lookup 
                    dataSource={tirePositionLookup}
                    displayExpr="name"
                    valueExpr="idTirePosition"
                />
            </Column>
            
            <Column 
                dataField="idProcessEvent"
                caption="Событие"
                dataType="number"
                width={150}
            >
                <Lookup 
                    dataSource={processEventLookup}
                    displayExpr="processEventName"
                    valueExpr="idProcessEvent"
                />
            </Column>
            
            <Column 
                dataField="startTimestamp"
                caption="Начало (метка времени)"
                dataType="datetime"
                sortIndex={0}
                sortOrder={"desc"}
                width={160}
            >
                <Format type="shortDateShortTime" />
            </Column>
            
            <Column 
                dataField="startDate"
                caption="Дата начала"
                dataType="date"
                width={120}
            >
                <Format type="shortDate" />
            </Column>
            
            <Column 
                dataField="endTimestamp"
                caption="Окончание (метка времени)"
                dataType="datetime"
                width={160}
            >
                <Format type="shortDateShortTime" />
            </Column>
            
            <Column 
                dataField="endDate"
                caption="Дата окончания"
                dataType="date"
                width={130}
            >
                <Format type="shortDate" />
            </Column>
            
            <Column 
                dataField="startMiliage"
                caption="Начальный пробег"
                dataType="number"
                format="#,##0 km"
                width={140}
            />
            
            <Column 
                dataField="endMiliage"
                caption="Конечный пробег"
                dataType="number"
                format="#,##0 km"
                width={140}
            />
            
            <Column 
                dataField="durationMiliage"
                caption="Пробег"
                dataType="number"
                format="#,##0 km"
                width={120}
            /> 

            <Column 
                dataField="comment"
                caption="Комментарий"
                dataType="string"
            />
        </DataGrid>
    </>

}