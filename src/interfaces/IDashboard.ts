export interface IActiveTire {
    idTire: number;
    tire: {
      serialNumber: string;
      tireModel: {
        modelName: string;
        tireBrand: {
          tireBrandName: string;
        };
      };
    };
    tirePosition: {
      tirePositionName: string;
    };
  }

export interface ILocationDashboard {  
  idLocation: number
  locationName: string;
  activeTires: IActiveTire[]
}



export interface IDashboard {

  locationTypeName: string;
  locations: ILocationDashboard[]
}