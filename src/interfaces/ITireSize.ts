export interface ITireSize {
    idTireSize: number,
    size: string,
    width?: number,
    profile?: number,
    diametr?: number,
    tireModels: { idTireModel: number }[]
}