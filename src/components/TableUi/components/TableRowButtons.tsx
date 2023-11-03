import {TTableRowButtonsProps} from '@/types/components/TableUi/components/TableRowButtons.js';
import {FC} from 'react';
import Button from '@/ui/Button/index.js';


const TableRowButtons: FC<TTableRowButtonsProps> = ({onEdit, rowIndex, onDelete}) => {

    return (
        <div data-testid={'TableRowButtons'} className="b-feature-table__row__action-buttons">
            <Button
                data-button-action={'edit'}
                data-testid={'TableRowButtons--edit'}
                variant={'link-primary'}
                onClick={() => onEdit(rowIndex)}
                className="b-button--link b-feature-table__row__action-button"
            >
                Edit
            </Button>
            <Button
                data-button-action={'delete'}
                data-testid={'TableRowButtons--delete'}
                variant={'link-danger'}
                onClick={() => onDelete(rowIndex)}
                className="b-button--link b-feature-table__row__action-button"
            >
                Delete
            </Button>
        </div>
    );
};

export default TableRowButtons;
