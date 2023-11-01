import {useCallback, useState} from "react";

export type TRect = {
    bottom: number, height: number, left: number, right: number, top: number, width: number, x: number, y: number
}
const useRefBoundingClientRect = () => {
    const [boundingClient, setBoundingClient] = useState<TRect>({
        bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0
    });

    const refCallback = useCallback((node: Element | null) => {
        if (node == null) return;
        setBoundingClient(node.getBoundingClientRect());
    }, [])

    return [boundingClient, refCallback] as const;
};

export default useRefBoundingClientRect;
