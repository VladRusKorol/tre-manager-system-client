interface IStaticsProps {
  totalTires: number,
  vehiclesTires: number,
  buildingsTires: number,
  emptyLocations: number
}

export const Statics: React.FC<IStaticsProps> = ({totalTires, vehiclesTires, buildingsTires, emptyLocations}) => {
    
    return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', marginBottom: '0px', padding: "30px"}}>
        
        <div style={{ background: "darkblue", padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#ffffff' }}>Всего отслеживаемых шин</div>
          <div style={{ fontSize: '44px', color: '#ffffff', fontWeight: 'bold', textAlign: "center"}}>{totalTires}</div>
        </div>

        <div style={{ background: "darkblue", padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#ffffff' }}>На оборудовании</div>
          <div style={{ fontSize: '44px', color: '#ffffff', fontWeight: 'bold', textAlign: "center"}}>{vehiclesTires}</div>
        </div>

        <div style={{ background: "darkblue", padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#ffffff' }}>В зданиях</div>
          <div style={{ fontSize: '44px', color: '#ffffff' , textAlign: "center"}}>{buildingsTires}</div>
        </div>

        <div style={{ background: "darkblue", padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', color: '#ffffff' }}>Пустые локации</div>
          <div style={{ fontSize: '44px', color: '#ffffff', fontWeight: 'bold' , textAlign: "center"}}>{emptyLocations}</div>
        </div>

    </div>

}