import React from "react";

export declare type Nullable<T = void> = T | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormTarget<T = any> {
    name: string;
    id: string;
    value: Nullable<T>;
    checked?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface FormEvent<T = any, E = React.SyntheticEvent> {
    originalEvent?: E;
    value: Nullable<T>;
    checked?: boolean;
    stopPropagation(): void;
    preventDefault(): void;
    target: FormTarget<T>;
}
