import {beforeEach, describe, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import App from '@/App.js';
import {UserEvent, userEvent} from '@testing-library/user-event';

const formSubmitting = async (user: UserEvent) => {
    const forms = await screen.findAllByTestId('TableForm');
    const inputs = forms[0].querySelectorAll('input');
    const select = forms[0].querySelector('.b-select__value');

    await user.type(inputs[0], 'Alex');
    await user.type(inputs[1], 'Sedov');
    await user.type(inputs[2], '23');

    if (select) await user.click(select);
    const options = await screen.findAllByTestId('Select-option');
    await user.click(options[0]);

    const submitButtons = await screen.findAllByTestId('TableForm--submit-ADD');
    await user.click(submitButtons[0]);
}

const copyTable = async (user:UserEvent) => {
    const copyButton = await screen.findByText('Copy table');
    await formSubmitting(user);
    await user.click(copyButton);
}

const deleteTableAssertion = async (tables:HTMLElement[]) => {
    await waitFor(async () =>
        expect(tables[0], 'Generated table renders on page').toBeInTheDocument(), {timeout: 1000});
    console.log('Generated tables amount before removing is:', tables.length);
    expect(tables.length).toBeGreaterThan(0);
}

describe('App flow test', () => {
    let user: UserEvent;
    beforeEach(() => {
        render(<App/>);
        user = userEvent.setup();
    });
    it('TableForm x2 should be on the page', async () => {
        await waitFor(async () => {
            const forms = await screen.findAllByTestId('TableForm');
            expect(forms[0]).toBeInTheDocument();
            expect(forms[1]).toBeInTheDocument();
        });
    });
    it('TableGenerator should be on the page', async () => {
        await waitFor(async () => expect(await screen.findByTestId('generator-table')).toBeInTheDocument());
    });
    it('TableGenerator should NOT be able to copy, if there is no rows added', async () => {
        const copyButton = await screen.findByText('Copy table');
        await user.click(copyButton);

        await waitFor(async () => expect(await screen.queryByTestId('generated-table'),
            'Element with id generated-table should be null').not.toBeInTheDocument())
    })
    it('Changing input values in TableForm 1 should change input value in TableForm 2', async () => {
        const tableForms = await screen.findAllByTestId('TableForm');
        const formOneInputs = tableForms[0].querySelectorAll('input');
        const formTwoInputs = tableForms[1].querySelectorAll('input');
        await user.type(formOneInputs[0], 'Aboba');
        await user.type(formOneInputs[1], 'Biba');
        await user.type(formOneInputs[2], '25');
        await waitFor(() => expect(formTwoInputs[0].value).toBe('Aboba'));
        await waitFor(() => expect(formTwoInputs[1].value).toBe('Biba'));
        await waitFor(() => expect(formTwoInputs[2].value).toBe('25'));
        await user.clear(formOneInputs[0]);
        await user.clear(formOneInputs[1]);
        await user.clear(formOneInputs[2]);
    });
    it('Validation output of TableForm 1 inputs should be visible in TableForm 2', async () => {
        const tableForms = await screen.findAllByTestId('TableForm');
        const formOneInputs = tableForms[0].querySelectorAll('input');
        await user.type(formOneInputs[0], '@#');

        await waitFor(async () => {
            const errorMessageDiv = tableForms[0].querySelector('.b-table-form__error');
            console.log('Error message div form 1: ', errorMessageDiv?.innerHTML);
            return expect(errorMessageDiv,
                'Error message for TableForm 1 input').toBeInTheDocument();
        });
        await waitFor(async () => {
            const errorMessageDiv = tableForms[1].querySelector('.b-table-form__error');
            console.log('Error message div form 2: ', errorMessageDiv?.innerHTML);
            return expect(errorMessageDiv,
                'Error message for TableForm 2 input').toBeInTheDocument();
        });
        const submitButtons = await screen.findAllByTestId('TableForm--submit-ADD');

        expect(submitButtons[0], 'Submit button for TableForm 1 disabled').toBeDisabled();
        expect(submitButtons[1], 'Submit button for TableForm 2 disabled').toBeDisabled();
        await user.clear(formOneInputs[0]);
    });
    it('After form submitting TableGenerator should get new table item', async () => {
        await formSubmitting(user);

        await waitFor(async () => expect(await screen.findByText('Sedov'),
            'On form submit row with Surname = Sedov added to the table generator').toBeInTheDocument(), {timeout: 1000});
    });
    it('Should be able to copy table state if there is at least one item', async () => {
        await copyTable(user);

        await waitFor(async () =>
            expect(await screen.findByTestId('generated-table'), 'Generated table renders on page').toBeInTheDocument(), {timeout: 1000});
    })
    it('Should be able to delete generated table', async () => {
        await copyTable(user);

        const tables = await screen.findAllByTestId('generated-table');
        await deleteTableAssertion(tables);
        const deleteTableBtns = await screen.findAllByTestId('delete-table-button');
        await user.click(deleteTableBtns[0]);
        await waitFor(() => {
            const tablesAfter = screen.queryAllByTestId('generated-table');
            console.log('Generated tables amount after removing is:', tablesAfter.length);
            return expect(tablesAfter.length).toBeLessThan(tables.length);
        }, {timeout: 2000});
    })
    it('Should be able to delete generated table by removing last row in it', async () => {
        await copyTable(user);

        const tables = await screen.findAllByTestId('generated-table');
        await deleteTableAssertion(tables);
        const deleteRow = tables[0].querySelectorAll('[data-button-action="delete"]');
        console.log(deleteRow.length);
        if (deleteRow) {
            for (let i = 0; i < deleteRow.length; i++) {
                await user.click(deleteRow[0]);
            }
        }
        await waitFor(() => {
            const tablesAfter = screen.queryAllByTestId('generated-table');
            console.log('Generated tables amount after removing is:', tablesAfter.length);
            return expect(tablesAfter.length).toBeLessThan(tables.length);
        }, {timeout: 3000});
    })
});
