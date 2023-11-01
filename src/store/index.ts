import React from "react";
import {BehaviorSubject, Subscription} from "rxjs";

export class Store<T> {
    protected readonly initialState:T
    protected readonly state: BehaviorSubject<T>;
    constructor(initialState:T) {
        this.initialState = initialState;
        this.state = new BehaviorSubject<T>(this.initialState);
    }

    subscribe(setState: React.Dispatch<React.SetStateAction<T>>):Subscription {
        return this.state.subscribe(setState);
    }

    getState() {
        return this.state.value
    }
}
