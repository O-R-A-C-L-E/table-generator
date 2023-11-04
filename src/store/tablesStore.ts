import React from 'react';
import {BehaviorSubject, map, Subscription} from 'rxjs';
import {TItem, TTable, TTablesInitialState, TTableSubject} from '../types/store/tablesStore.js';

const initialState: TTablesInitialState = {
    generator: new BehaviorSubject<TTable>({
        id: 'Generator',
        items: [],
    }),
    tables: new BehaviorSubject<TTableSubject[]>([]),
};

class TablesStore {
    private readonly state: TTablesInitialState;

    constructor(initialState: TTablesInitialState) {
        this.state = initialState;
    }

    copyTable() {
        if (this.state.generator.value.items.length === 0) return;
        this.state.tables.next([
            ...this.state.tables.value,
            new BehaviorSubject<Omit<TTable, 'initial'>>({...this.state.generator.value, id: Date.now()}),
        ]);
        console.log(this.state.tables);
    }

    deleteTable(tableId: number | string) {
        this.state.tables.next(this.state.tables.value.filter(el => el.value.id !== tableId));
    }

    subscribeOnTablesChange(setState: React.Dispatch<React.SetStateAction<TTable[]>>): Subscription {
        return this.state.tables.subscribe((el) => {
            setState(el.map(el => el.value));
        });
    }

    subscribeOnTableChange(tableId: number | string, setState: React.Dispatch<React.SetStateAction<TTable>>): Subscription {
        const tableSubject = this.getTableSubjectById(tableId);
        return tableSubject.subscribe(setState);
    }

    subscribeOnTableItemChange(tableId: number | string, setState: React.Dispatch<React.SetStateAction<TItem[]>>): Subscription {
        const tableSubject = this.getTableSubjectById(tableId);
        return tableSubject.pipe(
            map(el => el.items)
        ).subscribe(setState);
    }

    addTableItem(item: TItem) {
        this.state.generator.next({
            ...this.state.generator.value,
            items: [...this.state.generator.value.items, item],
        });
    }

    editTableItem(tableId: number | string, rowIndex: number, item: TItem) {
        const tableSubject = this.getTableSubjectById(tableId);
        if (!tableSubject) return;
        tableSubject.next({
            ...tableSubject.value,
            items: tableSubject.value.items.map((el, i) => {
                return i === rowIndex ? item : el;
            }),
        });
    }

    deleteTableItem(tableId: number | string, rowIndex: number) {
        const tableSubject = this.getTableSubjectById(tableId);
        if (!tableSubject) return;
        const updatedItems = tableSubject.value.items.filter((_, i) => {
            return i !== rowIndex;
        });
        if (tableSubject.value.id !== 'Generator' && updatedItems.length === 0) {
            this.deleteTable(tableId);
            return;
        }
        tableSubject.next({
            ...tableSubject.value,
            items: updatedItems,
        });
    }

    private getTableSubjectById(id: number | string): TTableSubject {
        if (id === 'Generator') return this.state.generator;
        return this.state.tables.getValue().filter(el => el.getValue().id === id)[0];
    }

    getTableState(id: number | string) {
        const table = this.getTableSubjectById(id);
        return table.getValue();
    }

    getState() {
        return this.state;
    }
}

export const tablesStore = new TablesStore(initialState);
