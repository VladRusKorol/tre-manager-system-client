import { Button } from "devextreme-react";
import type { ILocationDashboard } from "../../../../../../../interfaces/IDashboard";
import { TireCard } from "./TireCard";
import { useLocationCardModel } from "./model/useLocationCardModel";
import { useEffect, useState } from "react";

// Компонент карточки локации
interface LocationCardProps {
  location: ILocationDashboard;
  type: 'building' | 'vehicle';
  openMoveTirePopup: (id: number) => void;
}


export const LocationCard: React.FC<LocationCardProps> = ({ location, type, openMoveTirePopup }) => {
  const [isActiveAddButton, setIsActiveAddButton] = useState<boolean>(false);
  const { canAddTireInLocations, availableQuantityTire, wheelSchemaName} = useLocationCardModel({type})

  useEffect(()=>{
    const determinatedAdd = async () => {
      const result =  await canAddTireInLocations(location.activeTires.length, location.idLocation, type)
      if(!result) setIsActiveAddButton(false)
      else {
        setIsActiveAddButton(result)
      }
    }
    determinatedAdd()
  })

  return (
    <div style={{ marginBottom: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ 
        padding: '15px',
        background: type === 'building' ? '#e3f2fd' : '#e8f5e9',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ padding: '4px 12px', fontSize: '14px', fontWeight: "bolder" }}>
          {location.locationName}
        </span>
        <span style={{ padding: '4px 12px', borderRadius: '16px', background: location.activeTires.length > 0 ? '#4caf50' : '#9e9e9e', color: 'white', fontSize: '10px' }}>
          Установлено {location.activeTires.length} шин
        </span>
        {
          type !== "building" ? 
          <span style={{ padding: '4px 12px', borderRadius: '16px', background: location.activeTires.length > 0 ? '#4c61af' : '#9e9e9e', color: 'white', fontSize: '10px' }}>
            {wheelSchemaName} c максимально доступным кол-во шин: {availableQuantityTire})
          </span> :
          <></>
        }

        <Button text="Добавить шину" type="default" visible={isActiveAddButton}/>
      </div>

      {/* Список шин */}
      <div style={{ padding: '15px', background: 'white' }}>
        {
          location.activeTires.length > 0 
          ? 
          (
          location.activeTires.map(tire => (
            <TireCard key={tire.idTire} tire={tire} openMoveTirePopup={openMoveTirePopup}/>
          ))
          ) 
          : 
          (
          <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
            Нет шин в этой локации
          </div>
          )}
      </div>
    </div>
  );
};
