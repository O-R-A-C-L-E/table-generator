import {beforeEach, expect} from 'vitest';
import {render, screen} from '@testing-library/react';

import TableForm from '@/components/TableForm/TableForm.tsx';
import * as userEvent from '@testing-library/user-event';
import {UserEvent} from '@testing-library/user-event';

describe('TableForm component isolation tests', () => {
    let user:UserEvent;
    let nameInput:HTMLInputElement;
    let surnameInput:HTMLInputElement;
    let ageInput:HTMLInputElement;
    let select:HTMLDivElement;
    let submitButton:HTMLButtonElement;
    beforeEach(async () => {
        render(<TableForm type={'generator'} buttonText={'ADD'}/>);
        user = userEvent.default.setup();
        nameInput = await screen.findByPlaceholderText('Name');
        surnameInput = await screen.findByPlaceholderText('Surname');
        ageInput = await screen.findByPlaceholderText('Age');
        select = await screen.findByTestId('Select-component-value');
        submitButton = await screen.findByText('ADD');
        await user.clear(nameInput)
        await user.clear(surnameInput)
        await user.clear(ageInput)
    });
    it('Should render on page', () => {
        const tableForm = screen.findByTestId('TableForm');
        expect(tableForm).toBeDefined();
    });
    it('Should contain inputs with placeholders: Name, Surname, Age, City', async () => {
        const elements = await Promise.all([
            screen.findByPlaceholderText('Name'),
            screen.findByPlaceholderText('Surname'),
            screen.findByPlaceholderText('Age'),
            screen.findByPlaceholderText('City')
        ]);

        expect(elements.length).toBe(4);
    });
    it('Should not be able to submit form on empty input & should render error message', async () => {
        const submitButton = await screen.findByText('ADD') as HTMLButtonElement;
        await user.click(submitButton);
        const errorDivs = await screen.findAllByText('Field is required');
        expect(submitButton.disabled, 'Submit button gets disabled').toBeTruthy();
        expect(errorDivs.length, 'Error message is rendering for each validated input').toBe(4);
    });
    it('Should not be able to submit form on validated user input', async () => {
        await user.type(nameInput, 'Alex#');
        await user.type(surnameInput, 'Alex1');
        const errorDivs = await screen.findAllByText('No numbers or special characters allowed');
        expect(submitButton.disabled, 'Submit button gets disabled').toBeTruthy();
        expect(errorDivs.length, 'Error message is rendering for each validated input').toBe(2);
    });
    it('Should be able to submit filled form', async () => {
        await user.type(nameInput, 'Alex');
        await user.type(surnameInput, 'Sparrow');
        await user.type(ageInput, '27');
        await user.click(select);
        const option = await screen.findByText('Riga');
        await user.click(option);
        await user.click(submitButton);
        const errorDivs = await screen.queryAllByTestId('input-error-message');
        expect(submitButton.disabled, 'Submit button stays enabled').toBeFalsy();
        expect(errorDivs.length, 'No error message rendered').toBe(0);
    });
});
