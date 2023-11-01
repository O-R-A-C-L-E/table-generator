import {TTableControlsProps} from '@/types/components/TableUi/components/Controls.js';
import CrossImage from '@/assets/cross.svg?react';
import {tablesStore} from '@/store/tablesStore.js';
import Button from '@/ui/Button/index.js';
import {FC} from 'react';

const Controls: FC<TTableControlsProps> = ({initial, id}) => {
    const handleTableCopy = () => {
        console.log('inCOpy');
        tablesStore.copyTable(id);
    };

    const handleTableDelete = () => {
        tablesStore.deleteTable(id);
    };

    return (
        <div className="b-user-table__controls" style={{display: 'flex', width: '100%', justifyContent: 'end'}}>
            {
                initial ?
                    (
                        <Button
                            className="b-user-table__controls__button b-user-table__controls__copy-button"
                            onClick={handleTableCopy}>
                            Copy table
                        </Button>
                    )
                    :
                    (
                        <Button
                            className="b-user-table__controls__button b-user-table__controls__delete-button p-button-danger"
                            onClick={handleTableDelete}>
                            <CrossImage className="b-user-table__controls__delete-button__icon"/>
                        </Button>
                    )
            }
        </div>
    );
};

export default Controls;
