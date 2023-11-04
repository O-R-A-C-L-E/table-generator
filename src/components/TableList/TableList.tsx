import {FC} from "react";
import TableUi from "../TableUi/TableUi.js";
import {useTablesStoreState} from '@/components/TableList/TableList.hooks.js';

const TableList:FC = () => {
    const tables = useTablesStoreState();

    return (
        <div className="b-table-generator__table-list">
            {tables.map(({id}) => <TableUi data-testid='generated-table' key={id} tableId={id} initial={false} />)}
        </div>
    )
};

export default TableList;
