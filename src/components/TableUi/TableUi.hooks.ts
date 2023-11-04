import {useLayoutEffect, useState} from 'react';
import {TItem} from '@/types/store/tablesStore.js';
import {tablesStore} from '@/store/tablesStore.js';

export const useTablesStoreByTableId = (tableId: number | string) => {
    const [tableItems, setTableItems] = useState<TItem[]>(tablesStore.getTableState(tableId).items);
    useLayoutEffect(() => {
        const sub = tablesStore.subscribeOnTableItemChange(tableId, setTableItems);

        return () => {
            sub.unsubscribe();
        };
    }, [tableId]);

    return [tableItems, setTableItems] as const;
}
