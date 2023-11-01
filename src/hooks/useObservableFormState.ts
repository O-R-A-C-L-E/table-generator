import {ChangeEvent, useLayoutEffect, useMemo, useRef, useState} from "react";
import {formStore} from "../store/formStore.ts";
import {Subscription} from "rxjs";
import {ISelectChangeEvent} from "../ui/Select/index.js";
import useForm from "./useForm.js";
import {TFormState} from "../types/store/formStore.js";

const useObservableFormState = (shouldSubscribe:boolean, initialValue?:TFormState) => {
    const [formState, setFormState] = useState<TFormState>(initialValue || formStore.getState());
    const subRef = useRef<Subscription | null>(null);
    const validationSchema = useMemo(() => {
        return {
            name: {
                errorMessage: 'Required',
                validate: /\S[A-Za-z]/g,
            },
            surname: {
                errorMessage: 'Required',
                validate: /\S[A-Za-z]/g,
            },
            age: {
                errorMessage: 'Required',
                validate: /\S[0-9]/g,
            },
            city: {
                errorMessage: 'Required',
                validate: /\S[A-Za-z]/g,
            },
        }
    }, []);
    const [errors, errorsSubject] = useForm(formState, validationSchema);

    useLayoutEffect(() => {
        if (!shouldSubscribe) return;
        subRef.current = formStore.subscribe(setFormState);

        return () => {
            if (!subRef.current) return;
            subRef.current.unsubscribe();
        };
    }, [shouldSubscribe]);

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ISelectChangeEvent) => {
        if (shouldSubscribe) {
            formStore.handleChange(e.target.name, e.target.value);
            errorsSubject.next({
                ...formState,
                [e.target.name] : e.target.value,
            });
        } else {
            setFormState(prevState => {
                prevState[e.target.name as keyof TFormState] = e.target.value;
                errorsSubject.next(prevState);
                return {...prevState};
            });
        }
    };

    return [formState, handleChange, errors] as const;
};

export default useObservableFormState;
