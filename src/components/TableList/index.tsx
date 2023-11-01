import {FC, useEffect, useRef, useState} from "react";
import TableUi from "../TableUi/index.js";
import {Subscription} from "rxjs";
import {tablesStore} from '@/store/tablesStore.js';
import {TTable} from '@/types/store/tablesStore.js';

const TableList:FC = () => {
    const [tables, setTables] = useState<TTable[]>(tablesStore.getState().tables);
    const subRef = useRef<Subscription | null>(null);

    useEffect(() => {
        subRef.current = tablesStore.subscribeOnTablesChange(setTables);

        return () => {
            subRef.current?.unsubscribe();
        }
    }, [])

    return (
        <div className="b-table-generator__table-list">
            {tables.map(table => <TableUi key={table.id} {...table} />)}
        </div>
    )
};

export default TableList;
