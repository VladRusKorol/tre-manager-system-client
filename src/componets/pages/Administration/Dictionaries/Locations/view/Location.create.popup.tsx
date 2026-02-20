import { Button, Popup, Form, DataGrid } from "devextreme-react";
import { SimpleItem, GroupItem, Label } from "devextreme-react/form";
import { useCallback, useContext, useEffect, useState } from "react";
import type { ILocation } from "../../../../../../interfaces/ILocation";
import type { ILocationType } from "../../../../../../interfaces/ILocationType";
import { ToastContext } from "../../../../../../contexts/ToastContext";
import { apiClient } from "../../../../../../api/ApiClient";
import { gql } from "@apollo/client";

interface ICreateLocationPopupProps {
    isVisible: boolean,
    onHiding: () => void,
    dgRef: React.RefObject<DataGrid<ILocation, number> | null>
    locationKey? : number | null
    key: number
}

const TYPE_EQUIPMENT_ID = 2; 
const TYPE_BUILDING_ID = 1;

export const CreateLocationPopup: React.FC<ICreateLocationPopupProps> = ({
    isVisible, 
    onHiding, 
    dgRef,
    locationKey,
    key
}) => {

    const { showToast } = useContext(ToastContext);

    const [locationTypes, setLocationTypes] = useState<ILocationType[]>([])
    const [equipments, setEquipments] = useState<{ idEquipment: number, name: string }[]>([])
    const [buildings, setuBildings] = useState<{ idBuilding: number, name: string }[]>([])

    const [inputData, setInputData] = useState({
        displayName: "" as string ,
        idLocationType: null as number | null,
        idEquipment: null as number | null,
        idBuilding: null as number | null
    });


    const onFieldChange = (fieldName: string, value: any) => {
        
        setInputData(prev => {

            const next = { ...prev, [fieldName]: value };

            if (fieldName === "idLocationType") {

                if (value === TYPE_EQUIPMENT_ID){
                     next.idBuilding = null;
                }
                else if (value === TYPE_BUILDING_ID){
                     next.idEquipment = null;
                }
                else {
                    next.idBuilding = null;
                    next.idEquipment = null;
                }
            }
            return next;
        });

    };



    const handleSave = useCallback(async () => {

        if (inputData.displayName === null || inputData.displayName === "") {
            showToast("error", "Локация не может быть без названия");
            return;
        }
        if (inputData.idBuilding !== null && inputData.idEquipment !== null) {
            showToast("error", "Локация не может быть одновременно зданием и транспортом");
            return;
        }
        if (inputData.idBuilding === null && inputData.idEquipment === null) {
            showToast("error", "Локация не имеет привязки");
            return;
        }

        if (inputData.idLocationType === null) {
            showToast("error", "Выберите тип локации");
            return;
        }

        if (inputData.idLocationType === TYPE_EQUIPMENT_ID && inputData.idEquipment === null) {
            showToast("error", "Тип и ресурс локация не не сопоставим");
            return;
        }
        if (inputData.idLocationType === TYPE_BUILDING_ID && inputData.idEquipment !== null) {
            showToast("error", "Тип и ресурс локация не не сопоставим");
            return;
        }

        const gridInstance = dgRef.current?.instance;
        if (!gridInstance) return;
        const dataSource = gridInstance.getDataSource();
        const store = dataSource.store();

        try {
            if(locationKey) {
                await store.update(locationKey, {
                    idBuilding: inputData.idBuilding,
                    displayName: inputData.displayName,
                    idLocationType: inputData.idLocationType! as number,
                    idEquipment: inputData.idEquipment,
                })
            } else {
                await store.insert({
                    idLocation: 0,
                    displayName: inputData.displayName,
                    idLocationType: inputData.idLocationType! as number,
                    idEquipment: inputData.idEquipment,
                    idBuilding: inputData.idBuilding
                });
            }  
            await dataSource.reload();
            await gridInstance.repaint();
            onHiding();
        } catch (error) {
            showToast("error", "Ошибка при сохранении в базу данных");
            console.error(error);
        }
    },[inputData]);

    useEffect(()=> {

        const updateCase = async (key: number) => {
            const gridInstance = dgRef.current?.instance;
            if (!gridInstance) return;
            const dataSource = gridInstance.getDataSource();
            const store = dataSource.store();
            const updatedLoc = await store.byKey(key);
            setInputData({
                displayName: updatedLoc.displayName,
                idBuilding: updatedLoc.idBuilding ?? null,
                idEquipment: updatedLoc.idEquipment ?? null,
                idLocationType: updatedLoc.idLocationType
            })
        }

        if(isVisible){
            if(!locationKey){
                setInputData({
                    displayName: "",
                    idBuilding: null,
                    idEquipment: null,
                    idLocationType: null
                })
            } else {
                updateCase(locationKey)
            }
        }
    },[isVisible])

    useEffect(()=>{

        const loadInitialData = async () => {

            /* грузим массив непривязанных оборудований */
            type ET = { accessibleEquipments: {idEquipment: number, name: string}[] }

            const accessibleEquipments: ET | undefined = await apiClient.query<ET>(gql`
                query AccessibleEquipments {
                    accessibleEquipments {
                        idEquipment
                        name
                    }
                }
            `); 
            
            if(accessibleEquipments?.accessibleEquipments){
                setEquipments(accessibleEquipments?.accessibleEquipments)
            }

            if(locationKey){
                type CE = {locationByPK : { equipment : {idEquipment: number, name: string}}} | undefined
                const currentEquipment: CE = await apiClient.queryWithVars<CE>(gql`
                    query LocationByPK($ident: Int!) {
                        locationByPK(ident: $ident) {
                            equipment {
                                idEquipment
                                name
                            }
                        }
                    }
                `,{ident: locationKey}); 
                if(currentEquipment?.locationByPK.equipment){
                    const eqs : { idEquipment: number, name: string }[]  = [...equipments];
                    eqs.push({
                        idEquipment: currentEquipment?.locationByPK.equipment.idEquipment, 
                        name: currentEquipment?.locationByPK.equipment.name
                    }); 
                    setEquipments(eqs)
                }
            } 

            /* грузим массив непривязанных зданий */
            type BT = { accessibleBuildings: {idBuilding: number, name: string}[] }
            const accessibleBuildings: BT | undefined = await apiClient.query<BT>(gql`
                query AccessibleBuildings {
                    accessibleBuildings {
                        name
                        idBuilding
                    }
                }
            `); 
            if(accessibleBuildings?.accessibleBuildings){
                setuBildings(accessibleBuildings?.accessibleBuildings)
            }

            if(locationKey){
                type CB = {locationByPK : { building : {idBuilding: number, name: string}}} | undefined
                const currentBuilding: CB = await apiClient.queryWithVars<CB>(gql`
                    query LocationByPK($ident: Int!) {
                        locationByPK(ident: $ident) {
                            building {
                                idBuilding
                                name
                            }
                        }
                    }
                `,{ident: locationKey}); 
                if(currentBuilding?.locationByPK.building){
                    const bld : { idBuilding: number, name: string }[]  = [...buildings];
                    bld.push({
                        idBuilding: currentBuilding?.locationByPK.building.idBuilding, 
                        name: currentBuilding?.locationByPK.building.name
                    }); 
                    setuBildings(bld)
                }
            } 




            type LTT = { locationTypes: {idLocationType: number, name: string}[] }
            const locationTypes: LTT | undefined = await apiClient.query<LTT>(gql`
                query LocationTypes {
                    locationTypes {
                        idLocationType
                        name
                    }
                }
            `); 
            if(locationTypes?.locationTypes){
                setLocationTypes(locationTypes?.locationTypes)
            }


        }



        loadInitialData()

    },[locationKey])

    // useEffect(()=>{
    //     console.log(equipments)
    //     console.log(inputData)
    //     console.log(locationKey)
    // },[equipments, inputData, locationKey])

    return (
        <Popup
            visible={isVisible}
            onHiding={onHiding}
            dragEnabled={true}
            showTitle={true}
            title="СОЗДАНИЕ ЛОКАЦИИ В КОРПОРАТИВНОЙ СИСТЕМЕ УЧЕТА КГШ"
            width={650}
            height="auto"
            closeOnOutsideClick={true}
        >
            <div className="edit-popup">
                <Form 
                    formData={inputData} 
                    labelLocation="top" 
                    showRequiredMark={true}
                >
                    <GroupItem colCount={1}>
                        
                        {/* 1. Наименование */}
                        <SimpleItem 
                            dataField="displayName"
                            editorType="dxTextBox"
                            isRequired={true}
                            editorOptions={{
                                value: inputData.displayName,
                                onValueChanged: (e: any) => onFieldChange("displayName", e.value),
                                placeholder: "Введите название локации..."
                            }}
                        >
                            <Label text="Наименование локации" />
                        </SimpleItem>

                        {/* 2. Выбор типа (Подкидываем locationTypes) */}
                        <SimpleItem 
                            dataField="idLocationType"
                            editorType="dxSelectBox"
                            isRequired={true}
                            editorOptions={{
                                dataSource: locationTypes,
                                valueExpr: "idLocationType",
                                displayExpr: "name",
                                value: inputData.idLocationType,
                                onValueChanged: (e: any) => onFieldChange("idLocationType", e.value),
                                placeholder: "Выберите тип локации..."
                            }}
                        >
                            <Label text="Тип локации" />
                        </SimpleItem>

                        {/* 3. Оборудование (Разблокируется если выбран тип Оборудование) */}
                        <SimpleItem 
                            dataField="idEquipment"
                            editorType="dxSelectBox"
                            editorOptions={{
                                dataSource: equipments,
                                valueExpr: "idEquipment",
                                displayExpr: "name",
                                value: inputData.idEquipment,
                                disabled: inputData.idLocationType !== TYPE_EQUIPMENT_ID,
                                onValueChanged: (e: any) => onFieldChange("idEquipment", e.value),
                                placeholder: "Доступно только для типа 'Оборудование'",
                                showClearButton: true
                            }}
                        >
                            <Label text="Привязка к оборудованию" />
                        </SimpleItem>

                        {/* 4. Здание (Разблокируется если выбран тип Здание) */}
                        <SimpleItem 
                            dataField="idBuilding"
                            editorType="dxSelectBox"
                            editorOptions={{
                                dataSource: buildings,
                                valueExpr: "idBuilding",
                                displayExpr: "name",
                                value: inputData.idBuilding,
                                disabled: inputData.idLocationType !== TYPE_BUILDING_ID,
                                onValueChanged: (e: any) => onFieldChange("idBuilding", e.value),
                                placeholder: "Доступно только для типа 'Здание'",
                                showClearButton: true
                            }}
                        >
                            <Label text="Привязка к зданию" />
                        </SimpleItem>

                    </GroupItem>
                </Form>

                <div className="edit-popup-buttons" style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <Button 
                        text={locationKey ? "Обновить локацию" : "Создать локацию"} 
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