import {TRect} from '@/hooks/useRefBoundingClientRect.js';
import {ReactElement} from 'react';

export type TDropdownProps = {
    root?: Element | DocumentFragment;
    portal?: boolean
    containerPosition?: TRect;
    itemHeight: number
    multiple?: boolean;
    visible: boolean;
    className?: string;
    height?: number;
    children: ReactElement[];
};
