import {afterEach, beforeEach, describe, expect} from 'vitest';
import {tablesStore} from '@/store/tablesStore.js';
import {render, screen, waitFor} from '@testing-library/react';
import TableList from '@/components/TableList/TableList.js';
import {act} from 'react-dom/test-utils';

describe('TableList component isolation test', () => {
    beforeEach(async () => {
        render(<TableList/>);
        act(() => {
            tablesStore.addTableItem({
                name: 'Alex',
                surname: 'Sedov',
                age: '25',
                city: 'Riga',
            });
        })
    })
    afterEach(() => {
        act(() => {
            tablesStore.deleteTableItem('Generator', 0);
        })
    })
    it('Should render generated table', async () => {
        act(() => {
            tablesStore.copyTable();
        })
        await waitFor(async () => expect(await screen.findByTestId('generated-table')).toBeInTheDocument());
    });
})
