export interface IEquipmentModel {
    idEquipmentModel: string | number;
    name: string;
    idWheelSchema: number;
    equipments: {
      idEquipmentType: string | number;
    }[];
    wheelSchema: {
      name: string;
    };
}