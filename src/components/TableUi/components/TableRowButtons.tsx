import {TTableRowButtonsProps} from '@/types/components/TableUi/components/TableRowButtons.js';
import {FC} from "react";
import Button from "@/ui/Button/index.js";


const TableRowButtons: FC<TTableRowButtonsProps> = ({onEdit, rowIndex, onDelete}) => {

    return (
        <div className="b-user-table__row__action-buttons">
            <Button variant={'link-primary'} onClick={() => onEdit(rowIndex)} className='b-button--link b-user-table__row__action-button'>Edit</Button>
            <Button variant={'link-danger'} onClick={() => onDelete(rowIndex)} className='b-button--link b-user-table__row__action-button'>Delete</Button>
        </div>
    )
};

export default TableRowButtons;
