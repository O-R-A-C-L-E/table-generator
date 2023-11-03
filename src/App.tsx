import TableGenerator from './components/TableGenerator/TableGenerator.tsx';
import TableList from './components/TableList/TableList.tsx';
import './App.less';
import {tablesStore} from '@/store/tablesStore.js';
import {useCallback} from 'react';
import {TFormStateValues} from '@/types/store/formStore.js';
import TableForm from '@/components/TableForm/TableForm.js';

function App() {

    const handleSubmit = useCallback((formState: TFormStateValues) => {
        tablesStore.addTableItem(formState);
    }, []);

    return (
        <>
            <div className="b-table-generator">
                <div className="b-table-generator__table-form-container">
                    <TableForm
                        type={'generator'}
                        buttonText="ADD"
                        onSubmit={handleSubmit}
                    />
                    <TableForm
                        type={'generator'}
                        buttonText="ADD"
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
            <TableGenerator/>
            <TableList/>
        </>
    );
}

export default App;
