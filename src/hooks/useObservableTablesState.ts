import {useLayoutEffect, useRef, useState} from "react";
import {tablesStore} from "../store/tablesStore.ts";
import {Subscription} from "rxjs";
import {TTablesInitialState} from "../types/store/tablesStore.js";

const useObservableTablesState = () => {
    const [tablesState, setTablesState] = useState<TTablesInitialState>(tablesStore.getState());
    const subRef = useRef<Subscription | null>(null);

    useLayoutEffect(() => {
        subRef.current = tablesStore.subscribe(setTablesState);
        return () => {
            if (!subRef.current) return;
            subRef.current.unsubscribe();
        };
    }, []);

    return [tablesState, setTablesState] as const;
};

export default useObservableTablesState;
