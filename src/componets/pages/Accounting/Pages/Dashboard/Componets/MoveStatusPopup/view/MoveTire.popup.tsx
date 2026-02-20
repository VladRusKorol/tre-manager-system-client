import { Button, Form, Popup, ScrollView } from "devextreme-react"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import type { ITireStatusTrans } from "../../../../../../../../interfaces/ITireStatusTrans"
import { apiClient } from "../../../../../../../../api/ApiClient"
import { gql } from "@apollo/client"
import { ToastContext } from "../../../../../../../../contexts/ToastContext"
import { SignalEmmiter } from "../../../../../../../../common/SignalEmmiter"
import { SIGNAL_EMMITER_CONST } from "../../../../../../../../common/SIGNAL_EMMITER_CONSTS"

export interface IProps {
    isVisible: boolean,
    onHiding: () => void,
    enterIdTire : number | null
    key: number
}

type curState = {
    idTireStatusTrans: number,
    idTire:  number,
    idLocation:  number,
    idTirePosition: number,
    idStatus: number,
    idProcessEvent: number,
    startDate: Date,
    startTimestamp: Date,
    endTimestamp: Date | undefined | null,
    startMiliage: number, 
    comment: string
} | null

type loockups = { 
        locations: {
            idLocation: number,
            displayName: string
        }[],
        statuses: {
            idStatus: number,
            status: string
        }[],
         tirePositions: {
            idTirePosition: number,
            name: string
        }[],
        processEvents: {
            idProcessEvent: number,
            processEventName: string
        }[],
        tires: {
            idTire: number,
            serialNumber: string
        }[]
} | null


const signalEmitter = new SignalEmmiter(
    SIGNAL_EMMITER_CONST.MOVE_TIRE,[
        SIGNAL_EMMITER_CONST.REFRESH_DASHBOARD_DATA
    ]
)

export const MoveTirePopup: React.FC<IProps> = ({ isVisible, onHiding, enterIdTire, key }) => {
    const { showToast } = useContext(ToastContext)
    const [currentStatus, setCurrentStatus] = useState<curState>(null)
    const [loockupsStore, setLoockupsStore] = useState<loockups>(null)
    const [formData, setFormData] = useState<{
        endMiliageOldStatus: number,
        startMiliageNewStatus: number,
        endTimestamp?: Date | null,
        newIdLocation? : number | null
        newIdTirePosition?: number| null
        newIdStatus?: number| null
        newIdProcessEvent?: number| null
        newComment? : string | null
    }>({
        endMiliageOldStatus: 0,
        startMiliageNewStatus: 0
    })

    const readOnlyFormRef = useRef<Form>(null);

    // useEffect(()=>{
    //     // console.log(`idTireStatusTrans`)
    //     // console.log(idTireStatusTrans)
    //     // console.log(`currentStatus`)
    //     // console.log(currentStatus)
    //     console.log(`formData`)
    //     console.log(formData)
    // },[idTireStatusTrans,currentStatus,loockupsStore, formData])

    const handleSave = useCallback(async ()=>{
        const newId: {moveTire: { idTireStatusTrans: number }} | undefined = await apiClient.mutation(gql`
            mutation MoveTire($moveTireInput: MoveTireInput!) {
                moveTire(moveTireInput: $moveTireInput) {
                    idTireStatusTrans
                }
            }
        `,{moveTireInput: { 
            ...formData, 
            idTire: currentStatus?.idTire,
            idTirePosition: currentStatus?.idTirePosition,
            idTireStatusTrans: currentStatus?.idTireStatusTrans
        }})
        if(newId?.moveTire.idTireStatusTrans){
            showToast("success","Шина перемещена")
            signalEmitter.emit(); 
        } 
        onHiding()
    },[enterIdTire,currentStatus,loockupsStore, formData])

    useEffect(()=> {
        const loadData = async () => {
            type T = { tireStatusTransByIdTire : {
                idTireStatusTrans: number
                idTire: number
                idLocation: number
                idTirePosition: number
                idStatus: number
                idProcessEvent: number
                startDate: Date
                startTimestamp: Date
                endTimestamp?: Date | undefined | null
                startMiliage: number
                comment: string
            }[]} | undefined

            const request: T = await apiClient.queryWithVars<T>(gql`
                query TireStatusTransByIdTire($ident: Int!) {
                    tireStatusTransByIdTire(ident: $ident) {
                        idTireStatusTrans
                        idTire
                        idLocation
                        idTirePosition
                        idStatus
                        idProcessEvent
                        startDate
                        startTimestamp
                        endTimestamp
                        startMiliage
                        comment
                    }
            }`,{ ident: enterIdTire});
            
            if(request?.tireStatusTransByIdTire){
                const val = request?.tireStatusTransByIdTire.find(value => value.endTimestamp === undefined || value.endTimestamp === null)
                if(val){
                    setCurrentStatus({
                        idTireStatusTrans: val.idTireStatusTrans,
                        idTire: val.idTire,
                        idLocation: val.idLocation,
                        idTirePosition: val.idTirePosition,
                        idStatus: val.idStatus,
                        idProcessEvent: val.idProcessEvent,
                        startDate: val.startDate,
                        startTimestamp: val.startTimestamp,
                        endTimestamp: val.endTimestamp,
                        startMiliage: val.startMiliage, 
                        comment: val.comment
                    })
            }

            const requestLookup: any = await apiClient.query(gql`
                query Lookups {
                    locations {
                        idLocation
                        displayName
                    }
                    statuses {
                        idStatus
                        status
                    }
                    tirePositions {
                        idTirePosition
                        name
                    }
                    processEvents {
                        idProcessEvent
                        processEventName
                    }
                    tires {
                        idTire
                        serialNumber
                    }
                }
            `);
            if(requestLookup){
                setLoockupsStore(requestLookup)
            }

        }}
        if(enterIdTire === 0  && isVisible === false) return 
        
        loadData();
    },[isVisible,enterIdTire])

    return<>
        <Popup
            visible={isVisible}
            onHiding={onHiding}
            dragEnabled={true}
            showTitle={true}
            title="ПЕРЕМЕЩЕНИЕ АВТОШИНЫ"
            closeOnOutsideClick={true}
        >
            <ScrollView width={"100%"} height={"100%"} 
                showScrollbar="always" // или "onHover", "onScroll"
                useNative={false} // использование стилизованного скроллбара DevExtreme
            >
            <div className="popup-content" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                <div style={{ flex: 1, borderRight: '1px solid #ddd', paddingRight: '20px' }}>
                    <h2>Данные текущего статуса</h2>
                    <Form
                        ref={readOnlyFormRef}
                        formData={currentStatus}
                        readOnly={true}
                        items={[
                        {
                            itemType: "group",
                            //caption: "Связи с объектами",
                            colCount: 2,
                            items: [
                            {
                                dataField: "idTire",
                                label: { text: "Шина" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: loockupsStore?.tires, // Ваш источник данных для шин
                                    displayExpr: "serialNumber", // Поле для отображения
                                    valueExpr: "idTire",
                                    searchEnabled: true,
                                    placeholder: "Выберите шину"
                                },
                                //validationRules: [{ type: "required", message: "Шина обязательна" }]
                            },
                            {
                                dataField: "idLocation",
                                label: { text: "Местоположение" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: loockupsStore?.locations, // Ваш источник данных для локаций
                                    displayExpr: "displayName",
                                    valueExpr: "idLocation",
                                    searchEnabled: true,
                                    placeholder: "Выберите местоположение"
                                },
                                validationRules: [{ type: "required", message: "Местоположение обязательно" }]
                            },
                            {
                                dataField: "idStatus",
                                label: { text: "Статус" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                dataSource: loockupsStore?.statuses, // Ваш источник данных для статусов
                                    displayExpr: "status",
                                    valueExpr: "idStatus",
                                    searchEnabled: true,
                                    placeholder: "Выберите статус"
                                },
                                validationRules: [{ type: "required", message: "Статус обязателен" }]
                            },
                            {
                                dataField: "idTirePosition",
                                label: { text: "Позиция на ТС" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                dataSource: loockupsStore?.tirePositions, // Ваш источник данных для позиций
                                    displayExpr: "name",
                                    valueExpr: "idTirePosition",
                                    searchEnabled: true,
                                    placeholder: "Выберите позицию"
                                },
                                validationRules: [{ type: "required", message: "Позиция обязательна" }]
                            },
                            {
                                dataField: "idProcessEvent",
                                label: { text: "Событие процесса" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                dataSource: loockupsStore?.processEvents, // Ваш источник данных для событий
                                    displayExpr: "processEventName",
                                    valueExpr: "idProcessEvent",
                                    searchEnabled: true,
                                    placeholder: "Выберите событие"
                                },
                                validationRules: [{ type: "required", message: "Событие обязательно" }]
                            }
                            ]
                        },
                        
                        {
                            itemType: "group",
                            // caption: "Временные метки",
                            colCount: 2,
                            items: [
                                {
                                    dataField: "startTimestamp",
                                    label: { text: "Время начала статуса" },
                                    editorType: "dxDateBox",
                                    editorOptions: {
                                        type: "datetime",
                                        displayFormat: "dd.MM.yyyy HH:mm:ss",
                                        placeholder: "ДД.ММ.ГГГГ ЧЧ:ММ:СС",
                                        //showClearButton: true
                                    },
                                    //validationRules: [{ type: "required", message: "Время начала обязательно" }]
                                },
                                {
                                    dataField: "startDate",
                                    label: { text: "Дата начала статуса" },
                                    editorType: "dxDateBox",
                                    editorOptions: {
                                        type: "date",
                                        displayFormat: "dd.MM.yyyy",
                                        placeholder: "ДД.ММ.ГГГГ",
                                        //showClearButton: true
                                    },
                                    //validationRules: [{ type: "required", message: "Дата начала обязательна" }]
                                },
                                /*
                                {
                                    dataField: "endTimestamp",
                                    label: { text: "Время окончания" },
                                    editorType: "dxDateBox",
                                    editorOptions: {
                                    type: "datetime",
                                    displayFormat: "dd.MM.yyyy HH:mm:ss",
                                    placeholder: "ДД.ММ.ГГГГ ЧЧ:ММ:СС",
                                    showClearButton: true
                                    },
                                    visible: true,
                                    //allowNull: true
                                },
                                {
                                    dataField: "endDate",
                                    label: { text: "Дата окончания" },
                                    editorType: "dxDateBox",
                                    editorOptions: {
                                    type: "date",
                                    displayFormat: "dd.MM.yyyy",
                                    placeholder: "ДД.ММ.ГГГГ",
                                    showClearButton: true
                                    },
                                    visible: true,
                                    //allowNull: true
                                }*/
                            ]
                        },
                        
                        {
                            itemType: "group",
                            //caption: "Пробег оборудования на начало статуса",
                            colCount: 2,
                            items: [
                            {
                                dataField: "startMiliage",
                                label: { text: "Пробег оборудования на начало статуса" },
                                editorType: "dxNumberBox",
                                editorOptions: {
                                format: "#0.##",
                                showSpinButtons: true,
                                step: 1,
                                min: 0,
                                placeholder: "0.00"
                                },
                                validationRules: [
                                    // { type: "required", message: "Начальный пробег обязателен" },
                                    { type: "range", min: 0, message: "Пробег не может быть отрицательным" }
                                ]
                            },/*
                                    {
                                        dataField: "endMiliage",
                                        label: { text: "Пробег на окончание" },
                                        editorType: "dxNumberBox",
                                        editorOptions: {
                                        format: "#0.##",
                                        showSpinButtons: true,
                                        step: 1,
                                        min: 0,
                                        placeholder: "0.00"
                                        },
                                        visible: true,
                                        //allowNull: true,
                                        // validationRules: [
                                        //   {
                                        //     type: "custom",
                                        //     message: "Конечный пробег должен быть больше начального",
                                        //     validationCallback: (e) => {
                                        //       const startMiliage = e.formData?.startMiliage;
                                        //       return e.value === null || e.value === undefined || e.value >= startMiliage;
                                        //     }
                                        //   }
                                        // ]
                                    },
                                    {
                                        dataField: "durationMiliage",
                                        label: { text: "Пробег за период" },
                                        editorType: "dxNumberBox",
                                        editorOptions: {
                                        format: "#0.##",
                                        readOnly: true,
                                        showSpinButtons: false
                                        },
                                        // calculateValue: (formData) => {
                                        //   if (formData.endMiliage && formData.startMiliage) {
                                        //     return formData.endMiliage - formData.startMiliage;
                                        //   }
                                        //   return null;
                                        // }
                                    }
                                */
                            ]
                        },
                        
                        {
                            itemType: "group",
                            //caption: "Комментарий",
                            colCount: 1,
                            items: [
                            {
                                dataField: "comment",
                                label: { text: "Комментарий специалиста по шиноучету" },
                                editorType: "dxTextArea",
                                editorOptions: {
                                height: 100,
                                maxLength: 500,
                                placeholder: "Введите комментарий...",
                                autoResizeEnabled: true
                                },
                                //allowNull: true
                            }
                            ]
                        }
                        ]}
                        labelLocation="top"
                        showColonAfterLabel={false}
                    />
                </div>
                <div style={{flex: 1}}>
                
                    <h2>Форма перемещения шины</h2>
                    <Form
                        // ref={editFormRef}
                        formData={formData}
                        onFieldDataChanged={(e) => setFormData({ ...formData, [e.dataField as string]: e.value })}
                        items={[
                            {
                                dataField: "endTimestamp",
                                label: { text: "Время окончания текущего статуса" },
                                editorType: "dxDateBox",
                                isRequired: true,
                                editorOptions: {
                                    type: "datetime",
                                    displayFormat: "dd.MM.yyyy HH:mm:ss",
                                    dateSerializationFormat: "yyyy-MM-dd HH:mm:ss",
                                    placeholder: "ДД.ММ.ГГГГ ЧЧ:ММ:СС",
                                    showClearButton: true
                                },
                                visible: true,
                            },
                            {
                                dataField: "endMiliageOldStatus",
                                label: { text: "Пробег оборудования на конец текущего статуса (0 если в здание)" },
                                editorType: "dxNumberBox",
                                editorOptions: {
                                    format: "0#",
                                    showSpinButtons: true,
                                    step: 1,
                                    min: 0,
                                    placeholder: "0"
                                },
                                validationRules: [
                                    { type: "required", message: " Конечный пробег обязателен" },
                                    { type: "range", min: 0, message: "Пробег не может быть отрицательным" }
                                ]
                            },
                            {
                                dataField: "startMiliageNewStatus",
                                label: { text: "Пробег оборудования на начало нового статуса (0 если в здание)" },
                                editorType: "dxNumberBox",
                                editorOptions: {
                                format: "#0.##",
                                showSpinButtons: true,
                                step: 1,
                                min: 0,
                                placeholder: "0.00"
                                },
                                validationRules: [
                                    // { type: "required", message: "Начальный пробег обязателен" },
                                    { type: "range", min: 0, message: "Пробег не может быть отрицательным" }
                                ]
                            },
                            {
                                dataField: "newIdLocation",
                                label: { text: "Новое местоположение" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    dataSource: loockupsStore?.locations, // Ваш источник данных для локаций
                                    displayExpr: "displayName",
                                    valueExpr: "idLocation",
                                    searchEnabled: true,
                                    placeholder: "Выберите местоположение"
                                },
                                validationRules: [{ type: "required", message: "Местоположение обязательно" }]
                            },
                            {
                                dataField: "newIdStatus",
                                label: { text: "Новый статус" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                dataSource: loockupsStore?.statuses, // Ваш источник данных для статусов
                                    displayExpr: "status",
                                    valueExpr: "idStatus",
                                    searchEnabled: true,
                                    placeholder: "Выберите статус"
                                },
                                validationRules: [{ type: "required", message: "Статус обязателен" }]
                            },
                            {
                                dataField: "newIdTirePosition",
                                label: { text: "Новая позиция на здании/ вздании" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                dataSource: loockupsStore?.tirePositions, // Ваш источник данных для позиций
                                    displayExpr: "name",
                                    valueExpr: "idTirePosition",
                                    searchEnabled: true,
                                    placeholder: "Выберите позицию"
                                },
                                validationRules: [{ type: "required", message: "Позиция обязательна" }]
                            },
                            {
                                dataField: "newIdProcessEvent",
                                label: { text: "Событие для нового статуса" },
                                editorType: "dxSelectBox",
                                editorOptions: {
                                dataSource: loockupsStore?.processEvents, // Ваш источник данных для событий
                                    displayExpr: "processEventName",
                                    valueExpr: "idProcessEvent",
                                    searchEnabled: true,
                                    placeholder: "Выберите событие"
                                },
                                validationRules: [{ type: "required", message: "Событие обязательно" }]
                            },
                            {
                                dataField: "newComment",
                                label: { text: "Комментарий специалиста по шиноучету" },
                                editorType: "dxTextArea",
                                editorOptions: {
                                    height: 100,
                                    maxLength: 500,
                                    placeholder: "Введите комментарий...",
                                    autoResizeEnabled: true
                                },
                                //allowNull: true
                            }
                        ]}
                        labelLocation="top"
                        validationGroup="userData"
                        showValidationSummary={true}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <Button
                        text="Отмена"
                        onClick={onHiding}
                        stylingMode="outlined"
                        type="normal"
                    />
                    <Button
                        text="Сохранить"
                        onClick={handleSave}
                        type="success"
                        stylingMode="contained"
                    />
                    <Button
                        text="SHOW"
                        onClick={()=>{
                            alert(enterIdTire)
                            alert(`${JSON.stringify(currentStatus)}}`)
                        }}
                        type="success"
                        stylingMode="contained"
                    />
                </div>
            </div>
            </ScrollView>
        </Popup>
    </>
}