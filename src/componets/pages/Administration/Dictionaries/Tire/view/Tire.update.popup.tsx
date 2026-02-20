import { Button, Popup, Form, DataGrid } from "devextreme-react";
import { SimpleItem, GroupItem, Label } from "devextreme-react/form";
import { useCallback, useContext, useEffect, useState } from "react";
import type { ILocation } from "../../../../../../interfaces/ILocation";
import type { ILocationType } from "../../../../../../interfaces/ILocationType";
import { ToastContext } from "../../../../../../contexts/ToastContext";
import { apiClient } from "../../../../../../api/ApiClient";
import { gql } from "@apollo/client";
import type { ITire } from "../../../../../../interfaces/ITire";
import type CustomStore from "devextreme/data/custom_store";

interface IUpdateTirePopupProps {
    isVisible: boolean,
    onHiding: () => void,
    dgRef: React.RefObject<DataGrid<ITire, number> | null>,
    tireModelLookup: CustomStore<{ idTireModel: number; name: string; }, any>
    tireKey: number | null,
    key: number
}


export const UpdateTirePopup: React.FC<IUpdateTirePopupProps> = ({
    isVisible, 
    onHiding, 
    dgRef,
    tireModelLookup,
    tireKey,
    key
}) => {

    const [updateData, setUpdateData] = useState({
        serialNumber: null as string | null,
        idTireModel:   null as number | null,
        entrySystemData: null as string | null,
    })
    const [loadedData, setLoadedData] = useState<ITire | null>();

    /*загрузка данных */
    useEffect(()=>{
        const loadData = async (key: number) => {
            const gridInstance = dgRef.current?.instance;
            if (!gridInstance) return;
            const dataSource = gridInstance.getDataSource();
            const store = dataSource.store();
            const updatedTire = await store.byKey(key);
            setLoadedData({...updatedTire})
            setUpdateData({
                serialNumber: updatedTire.serialNumber,
                idTireModel: updatedTire.idTireModel,
                entrySystemData: updatedTire.entrySystemData
            })
        }
        if(isVisible){
            if(!tireKey){
                setUpdateData({
                    serialNumber: null,
                    idTireModel: null,
                    entrySystemData: null
                })
            } else {
                loadData(tireKey)
            }
        }
    },[isVisible])


    const handleSave = useCallback(async () => {
        if(tireKey){
            const gridInstance = dgRef.current?.instance;
            if (!gridInstance) return;
            const dataSource = gridInstance.getDataSource();
            const store = dataSource.store();
            await store.update(tireKey, {
                ...loadedData,
                serialNumber: updateData.serialNumber ?? loadedData?.serialNumber,
                idTireModel: updateData.idTireModel ?? loadedData?.idTireModel,
                entrySystemData: updateData.entrySystemData ?? loadedData?.entrySystemData,
            })
            await dataSource.reload();
            await gridInstance.repaint();
        }

        onHiding(); 
    },[updateData])

    return (
        <Popup
            visible={isVisible}
            onHiding={onHiding}
            dragEnabled={true}
            showTitle={true}
            title="ОБНОВЛЕНИЕ ШИНЫ В КОРПОРАТИВНОЙ СИСТЕМЕ УЧЕТА КГШ"
            width={650}
            height="auto"
            closeOnOutsideClick={true}
        >
            <div className="edit-popup">
                <Form 
                    formData={updateData} 
                    labelLocation="top" 
                    showRequiredMark={true}
                >
                    <GroupItem colCount={1}>
                        
                        {/* 1. Наименование */}
                        <SimpleItem 
                            dataField="serialNumber"
                            editorType="dxTextBox"
                            isRequired={true}
                            editorOptions={{
                                value: updateData.serialNumber,
                                onValueChanged: (e: any) => setUpdateData({
                                    ...updateData,
                                    serialNumber: e.value
                                })
                            }}
                        >
                            <Label text="Серийный номер" />
                        </SimpleItem>

                        <SimpleItem 
                            dataField="idTireModel"
                            editorType="dxSelectBox"
                            editorOptions={{
                                dataSource: tireModelLookup,
                                valueExpr: "idTireModel",
                                displayExpr: "name",
                                value: updateData.idTireModel,
                                onValueChanged: (e: any) => {
                                    setUpdateData({
                                        ...updateData, idTireModel: e.value
                                    })
                                }
                            }}
                        >
                            <Label text="Привязка к оборудованию" />
                        </SimpleItem>

                        <SimpleItem 
                            dataField="entrySystemData"
                            editorType="dxDateBox"
                            editorOptions={{
                                value: updateData.entrySystemData ? new Date(updateData.entrySystemData) : null,
                                onValueChanged: (e: any) => {
                                    // Конвертируем в строку для стабильного сравнения

                                    let newValue = null;
                                    if (e.value) {
                                        if (e.value instanceof Date) {
                                            // Если это Date объект
                                            newValue = e.value.toISOString().split('T')[0];
                                        } else if (typeof e.value === 'string') {
                                            // Если это строка
                                            newValue = e.value;
                                        }
                                    }
                                    
                                    setUpdateData(prev => {
                                        // Сравниваем строки, а не объекты Date
                                        if (prev.entrySystemData === newValue) return prev;
                                        return {
                                            ...prev,
                                            entrySystemData: newValue
                                        };
                                    });
                                },
                                type: "date", // или "datetime"
                                displayFormat: "dd.MM.yyyy",
                                placeholder: "Выберите дату"
                            }}
                        >
                            <Label text="Дата ввода в систему" />
                        </SimpleItem>

                    </GroupItem>
                </Form>

                <div className="edit-popup-buttons" style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Button 
                        text={"Обновить шину"} 
                        type="success" 
                        stylingMode="contained" 
                        onClick={handleSave} 
                    />
                    <Button 
                        text="Отмена" 
                        type="normal" 
                        stylingMode="contained" 
                        onClick={onHiding} 
                    />
                </div>
            </div>
        </Popup>
    );
};