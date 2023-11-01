import {TOption} from "./index.js";
import * as React from "react";

export const getValue = (type: 'value' | 'caption', el:TOption | undefined) => {
    if (typeof el === 'object' && el) return el[type];
    return el;
};

export function scrollThrottle(callbackFn: (e: React.UIEvent<HTMLDivElement>) => void, limit: number): React.UIEventHandler<HTMLDivElement> {
    let wait = false;
    return function (e) {
        if (!wait) {
            callbackFn.call(null, e);
            wait = true;
            setTimeout(function () {
                wait = false;
            }, limit);
        }
    }
}
