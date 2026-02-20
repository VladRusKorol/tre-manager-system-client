import { Toast } from "devextreme-react";
import { createContext, useCallback, useRef } from "react";
import { ToastContext, type TMessageType } from "./ToastContext";


export const ToastContextWrapper: React.FC<{children:React.ReactNode}> = ({children}) => {
    const toastRef = useRef<Toast>(null);

    const showToast = useCallback((messageType: TMessageType, message: string) => {
        toastRef.current?.instance.option("type", messageType);
        toastRef.current?.instance.option("message", message);
        toastRef.current?.instance.show();
    },[])

    return <ToastContext.Provider value={{showToast}}>
        
        <Toast
            ref={toastRef}
            position={"bottom center"}
            closeOnClick
            displayTime={10000}
        />

        {children}
        
    </ToastContext.Provider>
}