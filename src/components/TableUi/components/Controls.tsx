import {ITableControlsProps} from '@/types/components/TableUi/components/Controls.js';
import CrossImage from '@/assets/cross.svg?react';
import {tablesStore} from '@/store/tablesStore.js';
import Button from '@/ui/Button/Button.js';
import {FC} from 'react';

const Controls: FC<ITableControlsProps> = ({initial, onDelete}) => {
    const handleTableCopy = () => {
        tablesStore.copyTable();
    };

    const handleTableDelete = () => {
        onDelete()
    };

    return (
        <div className="b-feature-table__controls" style={{display: 'flex', width: '100%', justifyContent: 'end'}}>
            {
                initial ?
                    (
                        <Button
                            className="b-feature-table__controls__button b-feature-table__controls__copy-button"
                            onClick={handleTableCopy}>
                            Copy table
                        </Button>
                    )
                    :
                    (
                        <Button
                            className="b-feature-table__controls__button b-feature-table__controls__delete-button"
                            data-testid={'delete-table-button'}
                            onClick={handleTableDelete}>
                            <CrossImage className="b-feature-table__controls__delete-button__icon"/>
                        </Button>
                    )
            }
        </div>
    );
};

export default Controls;
