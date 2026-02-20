import { useCallback, useState } from "react"
import { apiClient } from "../../../../../../../../api/ApiClient"
import { gql } from "@apollo/client"

export const useLocationCardModel = (props:{type: "building" | "vehicle"}) => {

    const [wheelSchemaName, setWheelSchemaName] = useState<string>('');
    const [availableQuantityTire, setAvailableQuantityTire] = useState<number>(0)

    const canAddTireInLocations = useCallback(async (currentQuantityTires: number, idLocation: number, type: 'building' | 'vehicle' )=>{
        if(type === "building"){
            return true
        }
        else {
            type T = {
                locationByPK: {
                    equipment: {
                        equipmentModel: {
                            wheelSchema: {
                                name: string
                                wheelSchemaPosition: { idTirePosition: number } []
                            }
                        }
                    }
                }
            } | undefined; 
            const request: T = await apiClient.queryWithVars<T>(gql`
                query LocationByPK($ident: Int!) {
                    locationByPK(ident: $ident) {
                        equipment {
                            equipmentModel {
                                wheelSchema {
                                    name
                                    wheelSchemaPosition {
                                        idTirePosition
                                    }
                                }
                            }
                        }
                    }
                }    
            `,{ident: idLocation});
            if(request){
                setWheelSchemaName(request.locationByPK.equipment.equipmentModel.wheelSchema.name);
                setAvailableQuantityTire(request.locationByPK.equipment.equipmentModel.wheelSchema.wheelSchemaPosition.length)
                return currentQuantityTires < request.locationByPK.equipment.equipmentModel.wheelSchema.wheelSchemaPosition.length 
            }
        }
    },[props])


    return {
        canAddTireInLocations,
        wheelSchemaName,
        availableQuantityTire
    }
}