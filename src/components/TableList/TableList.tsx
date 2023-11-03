import {FC, useEffect, useRef, useState} from "react";
import TableUi from "../TableUi/TableUi.js";
import {Subscription} from "rxjs";
import {tablesStore} from '@/store/tablesStore.js';
import {TTable} from '@/types/store/tablesStore.js';

const TableList:FC = () => {
    const [tables, setTables] = useState<TTable[]>(tablesStore.getState().tables.value.map(el => el.value));
    const subRef = useRef<Subscription | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        subRef.current = tablesStore.subscribeOnTablesChange(setTables);

        return () => {
            subRef.current?.unsubscribe();
        }
    }, []);


    return (
        <div className="b-table-generator__table-list" ref={listRef}>
            {tables.map(({id, ...rest}) => <TableUi data-testid='generated-table' key={id} tableId={id} {...rest} />)}
        </div>
    )
};

export default TableList;
