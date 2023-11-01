import {FC, ReactElement, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import TableRowButtons from './components/TableRowButtons.js';
import Controls from './components/Controls.js';
import Table from '@/ui/Table/index.js';
import Column from '@/ui/Table/components/Column/index.js';
import Modal from '@/ui/Modal/index.js';
import TableForm from '../TableForm/index.js';
import './styles.less';
import {Subscription} from 'rxjs';
import {tablesStore} from '@/store/tablesStore.js';
import {TTableUiProps} from '@/types/components/TableUi/index.js';
import {TItem} from '@/types/store/tablesStore.js';


const TableUi: FC<TTableUiProps> = (
    {
        initial,
        id,
        items,
    }
) => {
    const [tableItems, setTableItems] = useState<TItem[]>(items);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const tableChangeSubscriptionRef = useRef<Subscription | null>(null);

    useEffect(() => {
        tableChangeSubscriptionRef.current = tablesStore.subscribeOnTableItemChange(id, setTableItems);
        setTableItems(items);

        return () => {
            tableChangeSubscriptionRef.current?.unsubscribe();
        };
    }, [id, items]);

    const handleModalHide = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    const handleSubmit = useCallback((value: TItem) => {
        setIsModalVisible(false);
        tablesStore.editTableItem(id, selectedRowIndex, value);
    }, [id, selectedRowIndex]);

    const handleRowEdit = useCallback((rowIndex: number) => {
        setSelectedRowIndex(rowIndex);
        setIsModalVisible(true);
    }, []);

    const handleRowDelete = useCallback((rowIndex: number) => {
        setTableItems(prevState => {
            return prevState.filter((_, i) => i !== rowIndex);
        });
        tablesStore.deleteTableItem(id, rowIndex);
    }, [id]);

    const bodyTemplateName = useCallback((rowData: TItem): ReactElement => {
        return (
            <>
                <span className="b-table__cell-title">Name</span>
                {rowData.name}
            </>
        );
    }, []);

    const bodyTemplateSurname = useCallback((rowData: TItem): ReactElement => {
        return (
            <>
                <span className="b-table__cell-title">Surname</span>
                {rowData.surname}
            </>
        );
    }, []);

    const bodyTemplateAge = useCallback((rowData: TItem): ReactElement => {
        return (
            <>
                <span className="b-table__cell-title">Age</span>
                {rowData.age}
            </>
        );
    }, []);

    const bodyTemplateCity = useCallback((rowData: TItem): ReactElement => {
        return (
            <>
                <span className="b-table__cell-title">City</span>
                {rowData.city}
            </>
        );
    }, []);

    const bodyTemplateActionButtons = useCallback((_: TItem, rowIndex: number): ReactNode => {
        return <TableRowButtons onDelete={handleRowDelete} onEdit={handleRowEdit} rowIndex={rowIndex}/>;
    }, [handleRowDelete, handleRowEdit]);

    return (
        <div className="b-user-table">
            <Controls id={id} initial={initial}/>
            <Table
                withPlaceholderRows
                value={tableItems}
                className="b-user-table__table b-table--responsive"
            >
                <Column field="name" header="Name" body={bodyTemplateName}/>
                <Column field="surname" header="Surname" body={bodyTemplateSurname}/>
                <Column field="age" header="Age" body={bodyTemplateAge}/>
                <Column field="city" header="City" body={bodyTemplateCity}/>
                <Column header="" body={bodyTemplateActionButtons}/>
            </Table>
            <Modal visible={isModalVisible} onHide={handleModalHide}>
                <TableForm
                    className="b-user-table__form"
                    shouldSubscribe={false}
                    onSubmit={handleSubmit}
                    initialValue={{...tableItems[selectedRowIndex || 0]}}
                    buttonText="AGREE"
                />
            </Modal>
        </div>
    );
};

export default TableUi;
