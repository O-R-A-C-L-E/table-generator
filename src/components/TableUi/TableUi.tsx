import {FC, ReactElement, ReactNode, useCallback, useLayoutEffect, useRef, useState} from 'react';
import TableRowButtons from './components/TableRowButtons.js';
import Controls from './components/Controls.js';
import Table from '@/ui/Table/index.js';
import Column from '@/ui/Table/components/Column/index.js';
import Modal from '@/ui/Modal/index.js';
import TableForm from '../TableForm/TableForm.js';
import './styles.less';
import {Subscription} from 'rxjs';
import {tablesStore} from '@/store/tablesStore.js';
import {ITableUiProps} from '@/types/components/TableUi/index.js';
import {TItem} from '@/types/store/tablesStore.js';
import {useDelayUnmount} from '@/hooks/useDelayUnmount.js';


const TableUi: FC<ITableUiProps> = (
    {
        initial,
        tableId,
        items,
        className,
        ...rest
    }
) => {
    const [isMounted, setIsMounted] = useState(true);
    const shouldRender = useDelayUnmount(isMounted, 300);
    const [tableItems, setTableItems] = useState<TItem[]>(items);
    console.log(tableItems);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const tableChangeSubscriptionRef = useRef<Subscription | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        tableChangeSubscriptionRef.current = tablesStore.subscribeOnTableItemChange(tableId, setTableItems);
        setTableItems(items);

        return () => {
            tableChangeSubscriptionRef.current?.unsubscribe();
        };
    }, [tableId, items]);

    const handleModalHide = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleSubmit = useCallback((value: TItem) => {
        setIsModalVisible(false);
        tablesStore.editTableItem(tableId, selectedRowIndex, value);
    }, [tableId, selectedRowIndex]);

    const handleRowEdit = useCallback((rowIndex: number) => {
        setSelectedRowIndex(rowIndex);
        setIsModalVisible(true);
    }, []);

    const handleRowDelete = useCallback((rowIndex: number) => {
        setTableItems(prevState => {
            return prevState.filter((_, i) => i !== rowIndex);
        });
        tablesStore.deleteTableItem(tableId, rowIndex);
    }, [tableId]);

    const bodyTemplateName = (rowData: TItem): ReactElement => {
        return (
            <div className={'b-table__cell-content'}>
                <span className="b-table__cell-title">Name</span>
                <span className="b-table__cell-value">{rowData.name}</span>
            </div>
        );
    };

    const bodyTemplateSurname = (rowData: TItem): ReactElement => {
        return (
            <div className={'b-table__cell-content'}>
                <span className="b-table__cell-title">Surname</span>
                <span className="b-table__cell-value">{rowData.surname}</span>
            </div>
        );
    };

    const bodyTemplateAge = (rowData: TItem): ReactElement => {
        return (
            <div className={'b-table__cell-content'}>
                <span className="b-table__cell-title">Age</span>
                <span className="b-table__cell-value">{rowData.age}</span>
            </div>
        );
    };

    const bodyTemplateCity = (rowData: TItem): ReactElement => {
        return (
            <div className={'b-table__cell-content'}>
                <span className="b-table__cell-title">City</span>
                <span className="b-table__cell-value">{rowData.city}</span>
            </div>
        );
    };

    const bodyTemplateActionButtons = useCallback((_: TItem, rowIndex: number): ReactNode => {
        return <TableRowButtons onDelete={handleRowDelete} onEdit={handleRowEdit} rowIndex={rowIndex}/>;
    }, [handleRowDelete, handleRowEdit]);

    const handleTableDelete = () => {
        setIsMounted(false);
        setTimeout(() => {
            tablesStore.deleteTable(tableId);
        }, 300);
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`b-feature-table ${initial ? '' : isMounted ? 'table-copy-animation' : 'table-delete-animation'} ${className || ''}`}
            ref={containerRef}
            {...rest}
        >
            <Controls id={tableId} onDelete={handleTableDelete} initial={initial}/>
            <Table
                withPlaceholderRows
                value={tableItems}
                className="b-feature-table__table b-table--responsive"
            >
                <Column field="name" header="Name" body={bodyTemplateName}/>
                <Column field="surname" header="Surname" body={bodyTemplateSurname}/>
                <Column field="age" header="Age" body={bodyTemplateAge}/>
                <Column field="city" header="City" body={bodyTemplateCity}/>
                <Column header="" body={bodyTemplateActionButtons}/>
            </Table>
            <Modal visible={isModalVisible} onHide={handleModalHide}>
                <TableForm
                    className="b-feature-table__form"
                    shouldSubscribe={false}
                    onSubmit={handleSubmit}
                    type={'rowEdit'}
                    initialValue={{...tableItems[selectedRowIndex || 0]}}
                    buttonText="AGREE"
                />
            </Modal>
        </div>
    );
};

export default TableUi;
