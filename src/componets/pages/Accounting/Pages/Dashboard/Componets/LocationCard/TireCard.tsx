import { Button } from "devextreme-react";
import type { IActiveTire } from "../../../../../../../interfaces/IDashboard";
import React from "react";
import type { ClickEvent } from "devextreme/ui/button";

// Компонент карточки шины
interface TireCardProps {
  tire: IActiveTire;
  openMoveTirePopup: (id: number) => void;
}

export const TireCard: React.FC<TireCardProps> = React.memo(({ tire, openMoveTirePopup }) => {

  
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      padding: '12px',
      marginBottom: '10px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '2px 6px', borderRadius: '4px' }}>
          {tire.tire.serialNumber}
        </span>
        <span style={{ fontSize: '12px', color: '#999' }}>ID: {tire.idTire}</span>
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <span style={{ color: '#1976d2', fontWeight: 500 }}>{tire.tire.tireModel.tireBrand.tireBrandName}</span>
        <span style={{ margin: '0 8px', color: '#999' }}>•</span>
        <span style={{ color: '#666' }}>{tire.tire.tireModel.modelName}</span>
      </div>
      
      <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>
        Позиция: {tire.tirePosition.tirePositionName}
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent:"end"}}>
        <Button text="переместить" type="default" onClick={(e:ClickEvent)=>{
          openMoveTirePopup(tire.idTire)
        }}/>
        <Button text="списать" type="danger" />
      </div>
    </div>
  );
});
