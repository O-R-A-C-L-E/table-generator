import {describe, expect} from 'vitest';
import {tablesStore} from '@/store/tablesStore.js';
import {render, screen, waitFor} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import TableList from '@/components/TableList/TableList.js';

describe('TableList component isolation test', () => {
    it('Should render list of generated tables and should get state from global store', async () => {
        render(<TableList/>);
        await act(async () => {
            tablesStore.addTableItem({
                name: 'Alex',
                surname: 'Sedov',
                age: '25',
                city: 'Riga',
            });
        });
        await act(async () => {
            let count = 0;
            const intr = setInterval(() => {
                if (count === 3) clearInterval(intr);
                tablesStore.copyTable();
                count++;
            }, 1);
        });
        await waitFor(async () => {
            const tables = await screen.findAllByTestId('generated-table');
            expect(tables.length).toBe(4);
        }, {timeout: 4000});
    });
});
