import { createContext } from "react";

export type TMessageType = "custom" | "error" | "info" | "success" | "warning";

export interface IToastContext {
    showToast: (messageType: TMessageType, message: string) => void
}

export const ToastContext = createContext<IToastContext>({
    showToast: () => {throw new Error('Toast context not initialized')}
}); 
