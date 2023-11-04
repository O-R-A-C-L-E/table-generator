import {describe, expect} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import Modal from '@/ui/Modal/Modal.js';
import {useEffect, useState} from 'react';
import {userEvent} from '@testing-library/user-event';

const DumbComponent = ({testVisible}:{testVisible?: boolean}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!testVisible) return;
        setTimeout(() => {
            setVisible(false);
        }, 500);
    }, [testVisible]);

    const handleHide = () => {
        setVisible(false)
    }

    return <Modal visible={visible} onHide={handleHide} children={<span data-testid={'test-modal-children'}></span>}/>;
};
describe('UI: Modal component isolation test', () => {
    it('Should be on page and render passed children', async () => {
        render(<Modal visible={true} onHide={() => console.log('onHide')} children={<span data-testid={'test-modal-children'}></span>}/>)
        await waitFor(() => expect(screen.getByTestId('Modal'), 'Modal on page').toBeInTheDocument())
        await waitFor(() => expect(screen.getByTestId('test-modal-children'), 'Children rendered').toBeInTheDocument())
    })
    it('Should unmount on visible prop change to false', async () => {
        render(<DumbComponent testVisible={true}/>)
        await waitFor(async () => expect(await screen.queryByTestId('Modal'), 'Modal unmounted after visible prop changed').not.toBeInTheDocument(),
            {timeout: 1500});
    });
    it('Should unmount on Escape', async () => {
        const user = userEvent.setup();
        render(<DumbComponent/>)
        await user.keyboard('{Escape}');
        await waitFor(async () => expect(await screen.queryByTestId('Modal'), 'Modal unmounted after Escape key was pressed').not.toBeInTheDocument(),
            {timeout: 4000});
    });
});
