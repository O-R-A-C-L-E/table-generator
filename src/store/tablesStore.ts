import {Store} from "./index.ts";
import React from "react";
import {map, Subscription} from 'rxjs';
import {findTableByIdAndFilterNullish} from "../operators/findTableByIdAndFilterNullish.ts";
import {TItem, TTable, TTablesInitialState} from "../types/store/tablesStore.js";

const initialState: TTablesInitialState = {
    tables: [
        {
            id: Date.now(),
            items: [],
            initial: true,
        }
    ],
};

class TablesStore extends Store<TTablesInitialState> {
    copyTable(tableId: number) {
        console.log(tableId);
        const table = this.state.value.tables.find(el => el.id === tableId);
        if (!table?.items?.length) return
        console.log(table, this.state.value.tables);
        this.state.value.tables = [...this.state.value.tables, {...table, id: Date.now(), initial: false}];
        console.log(this.state.value.tables);
        this.state.next({
            ...this.state.value,
        });
    }

    deleteTable(tableId: number) {
        this.state.next({
            ...this.state.value,
            tables: this.state.value.tables.filter((el) => el.id !== tableId),
        });
    }

    subscribeOnTablesChange(setState: React.Dispatch<React.SetStateAction<TTable[]>>): Subscription {
        return this.state.pipe(
            map(el => el.tables),
        ).subscribe(setState);
    }

    subscribeOnTableChange(tableId: number, setState: React.Dispatch<React.SetStateAction<TTable>>): Subscription {
        return this.state.pipe(
            findTableByIdAndFilterNullish(tableId),
        ).subscribe(setState);
    }

    subscribeOnTableItemChange(tableId: number, setState: React.Dispatch<React.SetStateAction<TItem[]>>): Subscription {
        return this.state.pipe(
            findTableByIdAndFilterNullish(tableId),
            map(el => el.items),
        ).subscribe(setState);
    }

    addTableItem(tableIndex: number, item: TItem) {
        this.state.value.tables[tableIndex] = {
            ...this.state.value.tables[tableIndex],
            items: [...this.state.value.tables[tableIndex].items, item],
        };
        this.state.next({
            ...this.state.value,
        })
    }

    editTableItem(tableId: number, rowIndex: number, item: TItem) {
        const table = this.state.value.tables.find(el => el.id === tableId);
        if (!table) return;
        table.items = table.items.map((el, i) => {
            return i === rowIndex ? item : el;
        });
        this.state.next({
            ...this.state.value,
        })
    }
    deleteTableItem(tableId: number, rowIndex: number) {
        const table = this.state.value.tables.find(el => el.id === tableId);
        if (!table) return;
        table.items = table.items.filter((_, i) => {
            return i !== rowIndex;
        });
        if (!table.initial && !table.items.length) {
            this.deleteTable(tableId);
            return;
        }
        this.state.next({
            ...this.state.value,
        })
    }
}

export const tablesStore = new TablesStore(initialState);
