import {ComponentPropsWithRef, FC, ReactElement, ReactNode} from "react";
import {IColumnProps, TColumnBodyTemplate} from "./components/Column/index.tsx";
import TableRowPlaceholder from "./components/TableRowPlaceholder/index.tsx";
import {isFunction} from "rxjs/internal/util/isFunction";
import './styles.less';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TValueItem = Record<string, any>;

export type TValueItemArray = Array<TValueItem>;

type TTableLayout = 'fixed' | 'auto';

interface ITableProps extends ComponentPropsWithRef<'table'> {
    children: ReactElement<IColumnProps> | ReactElement<IColumnProps>[];
    value?: TValueItemArray;
    tableLayout?: TTableLayout;
    keyField?: string;
    withPlaceholderRows?: boolean;
    placeHolderRowsCount?: number;
}

type TColValue = {
    body?: TColumnBodyTemplate;
    field?: string;
}

const Table: FC<ITableProps> = (
    {
        children,
        className,
        value,
        tableLayout = 'fixed',
        keyField,
        withPlaceholderRows = false,
        placeHolderRowsCount = 5,
        ...rest
    }
) => {
    const columns =
        (Array.isArray(children) ? children : [children]).map(el => ({body: el.props.body, field: el.props.field}));

    const renderCellContent = (rowItem: TValueItem, rowIndex: number, columnItem: TColValue): ReactNode | undefined => {
        if (typeof columnItem.field === "string" && !columnItem.body) {
            return rowItem[columnItem.field] as ReactNode;
        }
        if (columnItem.body && !isFunction(columnItem.body)) {
            return columnItem.body;
        }
        if (columnItem.body && isFunction(columnItem.body)) {
            return columnItem.body(rowItem, rowIndex);
        }
        return undefined;
    }

    const getKey = (rowItem: TValueItem, index: number, uniqValueField?: string) => {
        if (!uniqValueField) return rowItem?.id || rowItem?.uid || rowItem?.uuid || index;
        return rowItem[uniqValueField];
    };
    console.log(value);
    return <table className={`b-table b-table--${tableLayout} ${className || ''}`} {...rest}>
        <thead className='b-table__head'>
        <tr className='b-table__row b-table__head__row'>{children}</tr>
        </thead>
        <tbody className='b-table__body'>
        {value?.map((rowItem, rowIndex) => (
            <tr data-testid='tbody-tr' className='b-table__row b-table__body__row' key={getKey(rowItem, rowIndex, keyField)}>
                {columns.map((columnItem, i) => (
                    <td className='b-table__cell b-table__body__cell' key={columnItem.field || i}>
                        {renderCellContent(rowItem, rowIndex, columnItem)}
                    </td>
                ))}
            </tr>
        ))}
        {withPlaceholderRows && <TableRowPlaceholder rowsLength={placeHolderRowsCount - (value?.length || 0)} columnsLength={columns.length || 0}/>}
        </tbody>
    </table>
};

export default Table;
