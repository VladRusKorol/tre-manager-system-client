import { useCallback, useState } from "react"

export const useMoveTireViewModel = () => {
    const [isVisibleMoveTirePopup, setIsVisibleMoveTirePopup] = useState<boolean>(false);
    const [enteIidTire, setEnteIidTire] = useState<number>(0);
    const openMoveTirePopup = useCallback((id: number)=>{
        setEnteIidTire(id);
        setIsVisibleMoveTirePopup(true);
    },[])
    const closeMoveTirePopup = useCallback(()=>{
        setEnteIidTire(0);
        setIsVisibleMoveTirePopup(false);
    },[])

    return {
        isVisibleMoveTirePopup,
        enteIidTire,
        openMoveTirePopup,
        closeMoveTirePopup
    }
    
}