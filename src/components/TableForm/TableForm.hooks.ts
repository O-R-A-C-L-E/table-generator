import {ChangeEvent, FormEvent, useLayoutEffect, useState} from 'react';
import {formStore} from '@/store/formStore.js';
import {TFormState, TFormStateValues} from '@/types/store/formStore.js';
import {TValidationSchema, validate} from '@/utils/validation.js';
import {getKeys} from '@/utils/getKeys.js';
import {ISelectChangeEvent} from '@/types/ui/Select.js';

const validation: TValidationSchema<TFormStateValues> = {
    name: {
        required: true,
        validators: [
            (value) => /[\d}{[\])(*&^%$#@!<> ]/g.test(value) && 'No numbers or special characters allowed'
        ],
        error: '',
        touched: false,
    },
    surname: {
        required: true,
        validators: [
            (value) => /[\d}{[\])(*&^%$#@!<> ]/g.test(value) && 'No numbers or special characters allowed'
        ],
        error: '',
        touched: false,
    },
    age: {
        required: true,
        error: '',
        touched: false,
    },
    city: {
        required: true,
        error: '',
        touched: false,
    }
};

const useObservableFormState = (type: string, initialState?: TFormStateValues) => {
    const [formState, setFormState] = useState<TFormState>(formStore.getState(type));

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ISelectChangeEvent) => {
        const values = {
            [e.target.name]: e.target.value,
        };
        const errors = validate(values, validation);
        formStore.handleChange(type, values, errors);
    };

    const handleFormSubmit = (onSubmit: (e: FormEvent<HTMLFormElement>) => void) => (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errors = validate(formState.values, validation);
        formStore.handleChange(type, formState.values, errors);
        if (getKeys(errors).filter(key => !errors[key].isValid).length === 0) {
            onSubmit(e);
            formStore.clear(type);
        }
    };


    useLayoutEffect(() => {
        const sub = formStore.subscribe(type, setFormState);
        if (initialState) {
            setFormState(prevState => {
                prevState.values = initialState;
                return {...prevState};
            });
        }

        return () => {
            sub.unsubscribe();
        };
    }, [type, initialState]);


    return [formState, handleChange, handleFormSubmit] as const;
};

export default useObservableFormState;
