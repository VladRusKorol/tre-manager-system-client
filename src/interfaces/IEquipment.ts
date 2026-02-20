export interface IEquipment {
    idEquipment: number,
    name: string,
    idEquipmentType: number,
    idEquipmentModel:number
    locations: { idLocation: number}[]
}

export interface ICreacteEquipmentInput {
    name: string,
    idEquipmentType: number,
    idEquipmentModel:number
}

export interface IUpdateEquipmentInput extends Partial<ICreacteEquipmentInput>{ }