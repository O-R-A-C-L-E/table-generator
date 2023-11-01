import {useCallback, useEffect, useRef, useState} from 'react';
import {TTable} from '@/types/store/tablesStore.js';
import {tablesStore} from '@/store/tablesStore.js';
import {Subscription} from 'rxjs';
import {TFormState} from '@/types/store/formStore.js';
import TableForm from '@/components/TableForm/index.js';


const TableGenerator = () => {
    const [table, setTable] = useState<TTable>(tablesStore.getState().tables[0]);
    const subRef = useRef<Subscription | undefined>(undefined);
    console.log(table);

    useEffect(() => {
        subRef.current = tablesStore.subscribeOnTableChange(table.id, setTable);

        return () => {
            subRef.current?.unsubscribe();
        };
    }, [table.id]);

    const handleSubmit = useCallback((formState: TFormState) => {
        tablesStore.addTableItem(0, formState);
    }, []);


    return (
        <div className="b-table-generator">
            <div className="b-table-generator__table-form-container">
                <TableForm
                    buttonText="ADD"
                    onSubmit={handleSubmit}
                />
                <TableForm
                    buttonText="ADD"
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    );

};

export default TableGenerator;
