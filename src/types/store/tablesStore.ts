export type TTable = {
    id: number;
    items: TItem[];
    initial: boolean
};

export type TItem = {
    name: string;
    surname: string;
    age: string;
    city: string;
};

export type TTablesInitialState = {
    tables: TTable[];
};
