import {TTable} from '@/types/store/tablesStore.js';

export interface ITableControlsProps extends Pick<TTable, 'initial' | 'id'> {
    onDelete: () => void;
}
