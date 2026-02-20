export interface ITireBrand {
    idTireBrand: number;
    name: string;
    comment?: string;
    tireModels: { idTireModel: number }[]
}