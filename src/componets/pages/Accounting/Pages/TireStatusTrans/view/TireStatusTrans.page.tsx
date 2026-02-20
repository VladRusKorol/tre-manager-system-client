import { useContext } from "react";
import { ToastContext } from "../../../../../../contexts/ToastContext";
import { useTireStatusTransModel } from "../model/useTireStatusTransModel";
import { TireStatusTransGrid } from "./TireStatusTrans.grid";

export const TireStatusTransPage: React.FC = () => {

    const { showToast } = useContext(ToastContext); 
    
    const { 
        dataSource
    } = useTireStatusTransModel({ showToast })
    

    return<>
        <TireStatusTransGrid 
            dataSource={dataSource}
        /> 
    </> 
}