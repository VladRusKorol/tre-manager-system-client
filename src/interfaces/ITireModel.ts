export interface ITireModel {
    idTireModel: number;
    name: string;
    idTireBrand: number;
    normalMiliage?: number;
    minimalMiliage?: number;
    idTireSeasonalityType: number;
    idTireSize: number;
    idTireCarcasType: number;
    protectorDepth?: number;
    tires: { idTire: number }[]
}