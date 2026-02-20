export interface ILocation {
  idLocation: number;
  displayName: string;
  idLocationType: number;
  idEquipment?: number | null;
  idBuilding?: number | null;
}