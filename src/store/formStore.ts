import {TFormState, TFormStateErrors, TFormStateValues} from '@/types/store/formStore.ts';
import {BehaviorSubject, Subscription} from 'rxjs';
import React from 'react';

export type TFormStoreInitialState = {
    [p:string]: BehaviorSubject<TFormState>
}

const formState:TFormState = {
    values: {
        name: '',
        surname: '',
        age: '',
        city: '',
    },
    errors: {}
};

const initialState = {
    generator: new BehaviorSubject(formState),
    rowEdit: new BehaviorSubject(formState),
}

class FormStore {
    private readonly state;
    constructor(initialState:TFormStoreInitialState) {
        this.state = initialState;
    }

    subscribe(type:string, setState: React.Dispatch<React.SetStateAction<TFormState>>): Subscription {
        if (!this.state[type]) this.state[type] = new BehaviorSubject(formState);
        return this.state[type].subscribe(setState);
    }

    handleChange(type:string, values: Partial<TFormStateValues>, errors?: TFormStateErrors) {
        this.state[type].next({
            ...this.state[type].value,
            values: {
                ...this.state[type].value.values,
                ...values,
            },
            errors: {
                ...this.state[type].value.errors,
                ...errors,
            }
        });
    }

    getState(type:string) {
        if (!this.state[type]) this.state[type] = new BehaviorSubject(formState);
        return this.state[type].value;
    }
}

export const formStore = new FormStore(initialState);
