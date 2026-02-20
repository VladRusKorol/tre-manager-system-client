export interface IWheelSchema {
    idWheelSchema: number,
    name: string,
    equipmentModels: { idEquipmentModel: number }[]
    wheelSchemaPosition: { idWheelSchemaPosition: number }[]
}