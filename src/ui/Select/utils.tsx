import * as React from "react";
import {TOption} from '@/types/ui/Select.js';

export const getValue = (type: 'value' | 'caption', el:TOption | undefined) => {
    if (typeof el === 'object' && el) return el[type];
    return el;
};

export const scrollThrottle = (callbackFn: (e: React.UIEvent<HTMLDivElement>) => void, limit: number): React.UIEventHandler<HTMLDivElement> => {
    let wait = false;
    return (e) => {
        if (!wait) {
            callbackFn.call(null, e);
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}
