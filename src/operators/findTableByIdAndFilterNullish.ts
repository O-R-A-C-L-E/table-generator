import {map, Observable, pipe, UnaryFunction} from "rxjs";
import {filterNullish} from "./filterNullish.js";
import {TTable, TTablesInitialState} from "../types/store/tablesStore.js";

export function findTableByIdAndFilterNullish(tableId: number): UnaryFunction<Observable<TTablesInitialState>, Observable<TTable>> {
    return pipe(
        map(el => el.tables.find(el => el.id === tableId)),
        filterNullish(),
    )
}
