import {FC, ReactNode} from "react";

type TTableRowPlaceholder = {
    rowsLength: number;
    columnsLength: number;
}
const TableRowPlaceholder:FC<TTableRowPlaceholder> = ({rowsLength, columnsLength}) => {
    const renderRows = ():ReactNode[] | undefined => {
        console.log(rowsLength)
        if (rowsLength <= 0) return;
        const result:ReactNode[] = [];
        for (let i = 0; i < rowsLength; i++) {
            result.push(<tr key={`${i}-row`} className='b-table__row b-table__body__row b-table__row--placeholder'>
                {renderColumns()}
            </tr>);
        }

        return result;
    };

    const renderColumns = ():ReactNode[] | undefined => {
        console.log('col', columnsLength)
        if (columnsLength <= 0) return;
        const result:ReactNode[] = [];

        for (let i = 0; i < columnsLength; i++) {
            result.push(<td key={`${i}-col`} className='b-table__cell b-table__body__cell b-table__body__cell--placeholder'></td>);
        }
        return result;
    };

    return renderRows();
};

export default TableRowPlaceholder;
