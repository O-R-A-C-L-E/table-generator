import * as React from 'react';
import {FC} from 'react';

export interface ISelectChangeEvent {
    target: {
        value: string;
        name: string;
    };
}

export type TOptionObject = {
    value: string;
    caption: string;
};
export type TOption = TOptionObject | string;

export interface ISelectProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onChange' | 'ref' | 'value'> {
    options: TOption[];
    onChange: (e: ISelectChangeEvent) => void;
    onClose?: () => void;
    multiple?: boolean;
    portal?: boolean;
    root?: Element | DocumentFragment;
    value: string | undefined;
    error?: boolean;
}

export interface IOptionProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onClick' | 'ref' | 'value'> {
    onClick?: (option: string) => void;
    value: TOption;
    deletable?: (option: TOption) => void;
    selected?: boolean;
}

export interface Composition {
    Option: FC<IOptionProps>;
}
