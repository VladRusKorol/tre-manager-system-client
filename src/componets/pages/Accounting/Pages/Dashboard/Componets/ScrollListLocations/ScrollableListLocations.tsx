
import ScrollView from "devextreme-react/scroll-view";
import type { ILocationDashboard } from "../../../../../../../interfaces/IDashboard";
import { LocationCard } from "../LocationCard/LocationCard";

interface IProps {
  dataArray: [] | ILocationDashboard[];
  type: 'building' | 'vehicle';
  openMoveTirePopup: (id: number) => void
}

export const ScrollableListLocations: React.FC<IProps> = ({ dataArray , type, openMoveTirePopup}) => {
  return (
    <ScrollView 
      height={"100%"} // Обязательно для прокрутки
      showScrollbar="always" // или "onHover", "onScroll"
      useNative={false} // использование стилизованного скроллбара DevExtreme
    >
  
      <div className="cards-container">
        {dataArray.map((item) => ((<>
            <LocationCard location={item} type={type} openMoveTirePopup={openMoveTirePopup}/>
           </>
          ))
        )}
      </div>
    </ScrollView>
  );
};