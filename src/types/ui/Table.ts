import {IColumnProps, TColumnBodyTemplate} from '@/ui/Table/components/Column/index.js';
import {ComponentPropsWithRef, ReactElement} from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TValueItem = Record<string, any>;

export type TValueItemArray = Array<TValueItem>;

type TTableLayout = 'fixed' | 'auto';

export interface ITableProps extends ComponentPropsWithRef<'table'> {
    children: ReactElement<IColumnProps> | ReactElement<IColumnProps>[];
    value?: TValueItemArray;
    tableLayout?: TTableLayout;
    keyField?: string;
    withPlaceholderRows?: boolean;
    placeHolderRowsCount?: number;
}

export type TColValue = {
    body?: TColumnBodyTemplate;
    field?: string;
}
