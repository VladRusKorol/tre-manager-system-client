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
            <TabPanel width="100%" height="100%" focusStateEnabled={false} animationEnabled={true} >

                <Item title="КГШ">
                    <TirePage />
                </Item>

                <Item title="СПРАВОЧНИКИ ДЛЯ УЧЕТА КГШ">
                    <TabPanel width="100%" height="100%" focusStateEnabled={false} animationEnabled={true}>
                        
                        <Item title="СОБЫТИЯ">
                            <ProcessEventPage />
                        </Item>

                        <Item title="СТАТУСЫ">
                            <StatusPage />
                        </Item>

                        <Item title="ЛОКАЦИИ">
                            <LocationsPage />
                        </Item>
                    </TabPanel>
                   
                </Item>

                <Item title="СПРАВОЧНИКИ АВТОШИН">
                    <TabPanel width="100%" height="100%" focusStateEnabled={false} animationEnabled={true}>
                        <Item title="КАРКАСЫ">
                            <TireCarcasTypePage />
                        </Item>
                        <Item title="СЕЗОННОСТЬ">
                            <TireSeasonalityTypePage />
                        </Item>
                        <Item title="ПРОИЗВОДИТЕЛИ">
                            <TireBrandPage />
                        </Item>
                         <Item title="МОДЕЛИ">
                            <TireModelPage/>
                        </Item> 
                        <Item title="РАЗМЕРЫ">
                            <TireSizePage />
                        </Item>
                    </TabPanel>
                </Item>

                
                <Item title={"СПРАВОЧНИКИ АВТОПАРКА"}>

                    <TabPanel width="100%" height="100%" focusStateEnabled={false} animationEnabled={true}>

                        <Item title="ТРАНСПОРТ">
                            <EquipmentsPage />
                        </Item>

                        <Item title="ТИПЫ ТРАНСПОРТА">
                            <EquipmentTypesPage />
                        </Item>

                        <Item title="МОДЕЛИ ТРАНСПОРТА">
                            <EquipmentModelPage />
                        </Item>

                        <Item title = "КОЛЕСНАЯ СХЕМА">
                            <WheelSchemaPage />
                        </Item>
                        
                    </TabPanel>
                    
                </Item>

                <Item title={"СПРАВОЧНИКИ СООРУЖЕНИЙ"}> 

                    <TabPanel width="100%" height="100%" focusStateEnabled={false} animationEnabled={true}>

                        <Item title={"ЗДАНИЯ"}>
                            
                            <BuildingPage />

                        </Item>

                        <Item title="ТИПЫ ЗДАНИЙ">

                            <BuildingTypePage />
                        
                        </Item>

                    </TabPanel>

                </Item>

            </TabPanel>
        </div>
    );
};