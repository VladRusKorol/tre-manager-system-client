import { useContext } from "react"
import { ToastContext } from "../../../../../../contexts/ToastContext"
import { useTireStatusTransModel } from "../../TireStatusTrans/model/useTireStatusTransModel"
import { useStatusTrasMasterDetailModel } from "../model/useStatusTrasMasterDetailModel"
import { StatusTransMastetDetailGrid } from "./StatusTransMastetDetail.grid"

interface IStatusTransMasterDetailPageProps {
    data: {data : { idTire: number, name: string}}
}
export const StatusTransMasterDetailPage: React.FC<IStatusTransMasterDetailPageProps> = ({
    data
}) => {
    
    const { showToast } = useContext(ToastContext)

    const { 
        dataSource,
        locationLookup,
        processEventLookup,
        statusLookup,
        tirePositionLookup

    } = useStatusTrasMasterDetailModel({tireKey: data.data.idTire})

    return<div className="v-box">
        <StatusTransMastetDetailGrid 
            dataSource={dataSource}
            locationLookup={locationLookup}
            processEventLookup={processEventLookup}
            statusLookup={statusLookup}
            tirePositionLookup={tirePositionLookup}
        />
    </div>
}