import {render} from '@testing-library/react';
import TableGenerator from '@/components/TableGenerator/TableGenerator.js';


describe('TableGenerator component isolation tests', () => {
    it('Should render TableUi component with data-testid="Generator"', async () => {
        const tableGenerator = render(<TableGenerator/>);
        const tableUi = await tableGenerator.findByTestId('generator-table');
        expect(tableUi).toBeDefined();
    });
});
