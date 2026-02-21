import type React from "react";
import './AdministrationPageStyles.css'
import { TabPanel } from "devextreme-react";
import { Item } from "devextreme-react/tab-panel";
import { LocationsPage } from "./Dictionaries/Locations/view/Locations.page";
import { EquipmentsPage } from "./Dictionaries/Equipment/view/Equpments.page";
import { EquipmentTypesPage } from "./Dictionaries/EquipmentType/view/EquipmentType.page";
import { WheelSchemaPage } from "./Dictionaries/WheelSchema/view/WheelSchema.page";
import { EquipmentModelPage } from "./Dictionaries/EquipmentModel/view/EquipmentModel.page";
import { BuildingTypePage } from "./Dictionaries/BuildingType/view/BuildingType.page";
import { BuildingPage } from "./Dictionaries/Building/view/Building.page";
import { ProcessEventPage } from "./Dictionaries/ProcessEvent/view/ProcessEvent.page";
import { StatusPage } from "./Dictionaries/Status/view/Status.page";
import { TireCarcasTypePage } from "./Dictionaries/TireCarcasType/view/TireCarcasType.page";
import { TireSeasonalityTypePage } from "./Dictionaries/TireSeasonalityType/view/TireSeasonalityType.page";
import { TireBrandPage } from "./Dictionaries/TireBrand/view/TireBrand.page";
import { TireSizePage } from "./Dictionaries/TireSize/view/TireSize.page";
import { TireModelPage } from "./Dictionaries/TireModel/view/TireModel.page";
import { TirePage } from "./Dictionaries/Tire/view/Tire.page";

export const AdministrationPage: React.FC = () => {

    return (
        <div className="administration-page-cont">
            <TabPanel className="app-panel-style" focusStateEnabled={false} animationEnabled={true} >
                <Item title="КГШ">
                    <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                        <TirePage />
                    </div>
                </Item>
                <Item title="СПРАВОЧНИКИ ДЛЯ УЧЕТА КГШ">
                    <TabPanel className="app-panel-style" focusStateEnabled={false} animationEnabled={true}>
                        <Item title="СОБЫТИЯ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <ProcessEventPage />
                            </div>
                        </Item>
                        <Item title="СТАТУСЫ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <StatusPage />
                            </div>
                        </Item>
                        <Item title="ЛОКАЦИИ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <LocationsPage />
                            </div>
                        </Item>
                    </TabPanel>       
                </Item>
                <Item title="СПРАВОЧНИКИ АВТОШИН">
                    <TabPanel className="app-panel-style" focusStateEnabled={false} animationEnabled={true}>
                        <Item title="КАРКАСЫ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <TireCarcasTypePage />
                            </div>
                        </Item>
                        <Item title="СЕЗОННОСТЬ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <TireSeasonalityTypePage />
                            </div>
                        </Item>
                        <Item title="ПРОИЗВОДИТЕЛИ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <TireBrandPage />
                            </div>
                        </Item>
                         <Item title="МОДЕЛИ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <TireModelPage/>
                            </div>
                        </Item> 
                        <Item title="РАЗМЕРЫ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <TireSizePage />
                            </div>
                        </Item>
                    </TabPanel>
                </Item>             
                <Item title={"СПРАВОЧНИКИ АВТОПАРКА"}>
                    <TabPanel className="app-panel-style" focusStateEnabled={false} animationEnabled={true}>
                        <Item title="ТРАНСПОРТ">
                             <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <EquipmentsPage />
                            </div>
                        </Item>
                        <Item title="ТИПЫ ТРАНСПОРТА">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <EquipmentTypesPage />
                            </div>
                        </Item>
                        <Item title="МОДЕЛИ ТРАНСПОРТА">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <EquipmentModelPage />
                            </div>
                        </Item>
                        <Item title = "КОЛЕСНАЯ СХЕМА">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <WheelSchemaPage />
                            </div>
                        </Item>
                    </TabPanel>
                </Item>
                <Item title={"СПРАВОЧНИКИ СООРУЖЕНИЙ"}> 
                    <TabPanel className="app-panel-style" focusStateEnabled={false} animationEnabled={true}>
                        <Item title={"ЗДАНИЯ"}>
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <BuildingPage />
                            </div>
                        </Item>
                        <Item title="ТИПЫ ЗДАНИЙ">
                            <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                                <BuildingTypePage />
                            </div>
                        </Item>
                    </TabPanel>
                </Item>
            </TabPanel>
        </div>
    );
};