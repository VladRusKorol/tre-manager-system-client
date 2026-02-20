export interface IBuilding {
    idBuilding: number,
    name: string,
    idBuildingType: number,
    buildingType: {
        idBuildingType: number
    },
    location: { idLocation: number }[]
}