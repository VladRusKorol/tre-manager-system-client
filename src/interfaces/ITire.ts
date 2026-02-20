export interface ITire {
  idTire: number;
  serialNumber: string;
  idTireModel: number;
  entrySystemData: string;  
  disposalDate?: string | null;
  entrySystemMiliage: number;
  currentMiliage: number;
  isActive: boolean;

}