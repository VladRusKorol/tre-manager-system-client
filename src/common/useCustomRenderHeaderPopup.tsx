import { useCallback } from "react"
import type { TEventDataGridRef } from "./TEventDataGridRef"

interface IProps<T> {
    eventDataGridRef: React.RefObject<TEventDataGridRef<T>>
}

// Добавляем <T> перед аргументами функции
export const useCustomRenderHeaderPopup = <T,>(props: IProps<T>) => {
    const { eventDataGridRef } = props;

    const onTitleRenderCallback = useCallback(() => {
        // Проверяем current на null, так как это RefObject
        const grid = eventDataGridRef.current;
        if (!grid) return undefined;

        switch (grid.event) {
            case "new": {
                return (
                    <div className="h-box" style={{ justifyContent: "center" }}>
                        <h2>
                            <span>{grid.popupTitle}</span>
                        </h2>
                    </div>
                )
            }
            case "edit": {
                return (
                    <div className="h-box" style={{ justifyContent: "center" }}>
                        <h2>
                            <span style={{ color: "DimGray" }}>{grid.popupTitle} </span>
                            <span style={{ color: "black", fontWeight: "bold" }}>
                                {grid.popupTitleEditName}
                            </span>
                        </h2>
                    </div>
                )
            }
            default:
                return undefined;
        }
    }, [eventDataGridRef])

    const onFormPopupShownCallback = useCallback((e: any) => {
        e.component.repaint()
    }, [])

    return { onTitleRenderCallback, onFormPopupShownCallback };
}