import {ComponentProps} from 'react';

export interface ITableUiProps extends ComponentProps<'div'> {
    tableId: string | number;
    initial: boolean;
}
