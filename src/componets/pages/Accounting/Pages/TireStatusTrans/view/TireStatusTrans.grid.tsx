import { DataGrid } from "devextreme-react"
import { Column, Selection, Paging, Pager, MasterDetail, Scrolling } from "devextreme-react/data-grid"
import type DataSource from "devextreme/data/data_source"
import { useEffect } from "react";
import { StatusTransMasterDetailPage } from "../../TireStatusTransMasterDetail/view/StatusTransMasterDetail.page";

// // Компонент для детальной информации
// const TireDetailTemplate = (detailData: any) => {


//     const rowData = detailData.data.data;
    
//     useEffect(()=>{
//         console.log(detailData)
//     },[detailData])

//     useEffect(()=>{

//     })

  
// };

interface IProps {
    dataSource: DataSource<{idTire: number, name: string}, number>,
}

export const TireStatusTransGrid: React.FC<IProps> = ({
    dataSource
}) => {
    return (

        <DataGrid<{ idTire: number; name: string} >
            style={{
                border: "5px solid gold"
            }}
            width={"100%"}
            height={"100%"}
            key={"idTire"}
            dataSource={dataSource}
            showBorders={true}
            focusedRowEnabled={true}
            showColumnLines={true}
            showRowLines={true}
            rowAlternationEnabled={true}
            showColumnHeaders={true}
            wordWrapEnabled={true}
            repaintChangesOnly={false}
            headerFilter={{ allowSearch: true, width: 350, height: 700 }}
            paging={{ enabled: false }}
            pager={{
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20, 50],
                showInfo: true,
                showNavigationButtons: true,
                visible: true,
                displayMode: "full",
                infoText: "Страница {0} из {1} (Всего: {2})"
            }}
            
            searchPanel={{ visible: true, width: 300 }}
            remoteOperations={false}
        >
            <Selection mode={"single"} />
            <Scrolling useNative={true} /*mode={"virtual"} showScrollbar={"always"} *//>
            
            <Column
                dataField="idTire"
                caption="№"
                width={70}
                alignment="center"
                sortIndex={0}
                sortOrder="asc"
                allowSorting={true} />

            <Column
                dataField="name"
                caption="ШИНА"
                minWidth={200}
                allowFiltering={true} />

            <MasterDetail
                enabled={true}
                component={StatusTransMasterDetailPage} />

        </DataGrid>
    );
};