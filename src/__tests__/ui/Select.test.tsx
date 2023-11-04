import {describe, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import Select from '@/ui/Select/Select.js';
import {userEvent} from '@testing-library/user-event';
import {useState} from 'react';
import {ISelectChangeEvent} from '@/types/ui/Select.js';

const DumbComponent = (props:{portal?:boolean, testVirt?: boolean}) => {
    const [val, setVal] = useState('');
    const handleChange = (e:ISelectChangeEvent) => {
        console.log(e);
        setVal(e.target.value);
    }
    let options = ['Moscow', 'Riga', 'St.Petersburg'];
    if (props.testVirt) {
        options = new Array(200).fill(Math.random().toString());
    }

    return (
        <Select options={options}  onChange={handleChange} value={val} {...props} />
    )
}
describe('Select: UI component isolation test', () => {
    it('should be on a page', async () => {
        render(<DumbComponent/>);
        expect(await screen.findByTestId('Select-component-value')).toBeInTheDocument();
    });
    it('Should render dropdown in portal by default', async () => {
        render(<DumbComponent/>);
        const user = userEvent.setup();
        await user.click(await screen.findByTestId('Select-component-value'));
        await waitFor(async () => expect(await screen.findByTestId('PortalDropdown')))
    })
    it('Should render dropdown in place if prop portal === false', async () => {
        render(<DumbComponent portal={false}/>);
        const user = userEvent.setup();
        await user.click(await screen.findByTestId('Select-component-value'));
        await waitFor(async () => expect(await screen.findByTestId('Dropdown')))
    })
    it('Should update state on option click', async () => {
        render(<DumbComponent/>);
        const user = userEvent.setup();
        await user.click(await screen.findByTestId('Select-component-value'));
        await waitFor(async () => expect(await screen.findByTestId('PortalDropdown')))
        const ops = await screen.findAllByTestId('Select-option');
        await user.click(ops[1]);
        await waitFor(async () => expect(await screen.findByText('Riga'), 'Value changed to Riga').toBeInTheDocument(), {timeout: 1000});
    });
})
