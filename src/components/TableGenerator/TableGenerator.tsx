import {useLayoutEffect, useState} from 'react';
import {tablesStore} from '@/store/tablesStore.js';
import TableUi from '@/components/TableUi/TableUi.js';


const TableGenerator = () => {
    const [table, setTable] = useState(tablesStore.getTableState('Generator'));

    useLayoutEffect(() => {
        const sub = tablesStore.subscribeOnTableChange('Generator', setTable);

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return (
        <TableUi data-testid={'generator-table'} tableId={'Generator'} items={table.items} initial={true}/>
    );

};

export default TableGenerator;
