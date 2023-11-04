import {useEffect, useState} from 'react';
import {TTable} from '@/types/store/tablesStore.js';
import {tablesStore} from '@/store/tablesStore.js';

export const useTablesStoreState = () => {
    const [tables, setTables] = useState<TTable[]>(tablesStore.getState().tables.value.map(el => el.value));

    useEffect(() => {
        const sub = tablesStore.subscribeOnTablesChange(setTables);

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return tables;
}
