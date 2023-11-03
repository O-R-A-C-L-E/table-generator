import {beforeEach, describe, expect} from 'vitest';
import {render, RenderResult, screen, waitFor} from '@testing-library/react';
import TableUi from '@/components/TableUi/TableUi.js';
import {userEvent} from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('TableUi component isolation tests', () => {
    let tableUi: RenderResult;
    beforeEach(() => {
        tableUi = render(<TableUi tableId={'Generator'} initial={true} items={[
            {
                name: 'Alex',
                surname: 'Sisov',
                age: '25',
                city: 'Riga',
            },
            {
                name: 'Andre',
                surname: 'Borch',
                age: '30',
                city: 'Ventspils',
            },
        ]}/>);
    });
    it('Should have two table rows', async () => {
        const rows = await tableUi.findAllByTestId('tbody-tr');
        expect(rows.length).toBe(2);
    });
    it('Each row should render TableRowButtons component', async () => {
        const els = await tableUi.findAllByTestId('TableRowButtons');
        expect(els.length).toBe(2);
    });
    it('Should be able to delete proper row on click on delete button', async () => {
        const user = userEvent.setup();
        const rows = await tableUi.queryAllByTestId('tbody-tr');
        console.log(rows.length);
        expect(rows.length, 'All rows length is 2').toBe(2);
        const btn = rows[1].querySelector('[data-button-action="delete"]');
        console.log(btn);
        if (btn) await user.click(btn);
        await waitFor(async () => expect(screen.queryByText('Andre'), 'Rows index=1 is not in the document').not.toBeInTheDocument());

        await waitFor(() => {
            expect(btn, 'TableRowButton--delete on row index=1 is not in the document').not.toBeInTheDocument();
        }, {timeout: 100});
    });
    it('Should be able to render modal with TableForm component on TableRowButtons--edit button click', async () => {
        const user = userEvent.setup();
        const els = await tableUi.findAllByTestId('TableRowButtons--edit');
        await user.click(els[0]);
        await waitFor(async () => expect(await screen.findByTestId('Modal'), 'Modal component rendered').toBeInTheDocument());
        await waitFor(async () => expect(await screen.findByTestId('TableForm'), 'TableForm component rendered').toBeInTheDocument());
    });
    it('Should be able to edit row data in rendered TableForm component', async () => {
        const user = userEvent.setup();
        const rows = await screen.findAllByTestId('tbody-tr');
        const editBtn = await rows[0].querySelector('[data-button-action="edit"]');
        console.log(editBtn);
        if (editBtn) await user.click(editBtn);

        await waitFor(async () => expect(await screen.findByTestId('Modal'), 'Modal component rendered').toBeInTheDocument());
        await waitFor(async () => expect(await screen.findByTestId('TableForm'), 'TableForm component rendered').toBeInTheDocument());

        const tableForm = await screen.findByTestId('TableForm');
        const inputs = tableForm.querySelectorAll('input');
        const citySelect = await tableForm.querySelector('.b-select');
        await user.clear(inputs[0]);
        await user.type(inputs[0], 'Bimbo');
        if (citySelect) await user.click(citySelect);
        const DaugavpilsOption = await screen.findByText('Daugavpils');
        await user.click(DaugavpilsOption);
        const submitButton = await screen.findByText('AGREE') as HTMLButtonElement;
        await user.click(submitButton);
        expect(!submitButton.disabled, 'Button enabled').toBeTruthy();
    });
});
