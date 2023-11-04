import {BehaviorSubject} from 'rxjs';

export type TTable = {
    id: string | number;
    items: TItem[];
};

export type TItem = {
    name: string;
    surname: string;
    age: string;
    city: string;
};

export type TTableSubject = BehaviorSubject<TTable>;

export type TTablesInitialState = {
    generator: TTableSubject;
    tables: BehaviorSubject<TTableSubject[]>
};
