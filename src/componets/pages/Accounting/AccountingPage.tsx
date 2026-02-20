import { TabPanel } from "devextreme-react";
import { Item } from "devextreme-react/tab-panel";
import type React from "react";
import { TireStatusTransPage } from "./Pages/TireStatusTrans/view/TireStatusTrans.page";
import { DashboardPage } from "./Pages/Dashboard/view/Dashboard.page";

export const AccountingPage: React.FC = () => {
    return <div className="accounting-page-cont">
        <TabPanel className="app-panel-style"
            focusStateEnabled={false} 
            animationEnabled={true} 
        >
            <Item
                title="ЖУРНАЛ УЧЕТА АВТОШИН"
            >
                <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                    <TireStatusTransPage />
                </div>
                
            </Item> 
            <Item title="ДАШБОРД СПЕЦИАЛИСТА">
                <div className="v-box" style={{ width:"100%", height: "100%", overflow: "hidden" }}>
                    <DashboardPage />
                </div>
            </Item> 
            <Item title="АНАЛИЗ ХОДИМОСТИ МОДЕЛЕЙ">
                {/* <TirePage /> */}
            </Item> 
        </TabPanel>
    </div>
}