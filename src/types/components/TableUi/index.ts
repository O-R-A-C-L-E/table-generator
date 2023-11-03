import {TItem} from '../../store/tablesStore.js';
import {ComponentProps} from 'react';

export interface ITableUiProps extends ComponentProps<'div'> {
    tableId: string | number;
    initial: boolean;
    items: TItem[];
}
