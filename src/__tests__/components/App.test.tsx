import {beforeEach, describe, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import App from '@/App.js';
import {UserEvent, userEvent} from '@testing-library/user-event';

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
        const submitButtons = await screen.findAllByTestId('TableForm--submit');

        expect(submitButtons[0], 'Submit button for TableForm 1 disabled').toBeDisabled();
        expect(submitButtons[1], 'Submit button for TableForm 2 disabled').toBeDisabled();
    });
    it('After form submitting TableGenerator should get new table item', async () => {
        const forms = await screen.findAllByTestId('TableForm');
        const inputs = forms[0].querySelectorAll('.b-inputtext__value');
        await user.clear(inputs[0]);
        await user.type(inputs[0], 'Alex');
        await user.clear(inputs[1]);
        await user.type(inputs[1], 'Sedov');
        await user.clear(inputs[2]);
        await user.type(inputs[2], '23');
        await user.click(inputs[3]);
        const options = await screen.findAllByRole('option');
        await user.click(options[0]);
        const submitButtons = await screen.findAllByTestId('TableForm--submit');
        await user.click(submitButtons[0]);

        await waitFor(async () => expect(await screen.findByText('Sedov'),
            'On form submit row with Surname = Sedov added to the table generator').toBeInTheDocument(), {timeout: 1000});
    });
    it('Should be able to copy table state if there is at least one item', async () => {
        const copyButton = await screen.findByText('Copy table');
        const forms = await screen.findAllByTestId('TableForm');
        const inputs = forms[0].querySelectorAll('.b-inputtext__value');
        await user.clear(inputs[0]);
        await user.type(inputs[0], 'Alex');
        await user.clear(inputs[1]);
        await user.type(inputs[1], 'Sedov');
        await user.clear(inputs[2]);
        await user.type(inputs[2], '23');
        await user.click(inputs[3]);
        const options = await screen.findAllByRole('option');
        await user.click(options[0]);

        const submitButtons = await screen.findAllByTestId('TableForm--submit');
        await user.click(submitButtons[0]);
        await user.click(copyButton);

        await waitFor(async () => expect(await screen.findByTestId('generated-table')).toBeInTheDocument())
    })
});
