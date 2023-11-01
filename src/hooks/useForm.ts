import {useEffect, useRef, useState} from "react";
import {BehaviorSubject, catchError, debounceTime, distinctUntilChanged, of} from "rxjs";
import {TValidationSchema} from "../types/hooks/useForm.js";

const useForm = <T extends object>(formState: T, validationSchema: TValidationSchema<T>) => {
    const errorsInitialState = Object.keys(formState).reduce<Record<string, string | null>>((prev, acc) => {
        prev[acc] = null;
        return prev;
    }, {}) as { [K in keyof T]: string };

    const [errors, setErrors] = useState(errorsInitialState);
    const validationSubjectRef = useRef(new BehaviorSubject(formState));

    useEffect(() => {
        const sub = validationSubjectRef.current;
        if (!sub) return;

        sub.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            catchError((error) => {
                console.log(error);
                return of(undefined)
            })
        ).subscribe((input) => {
            if (!input) return;
            setErrors(prevState => {
                let notValid = false;
                Object.entries(input).forEach(el => {
                    const name = el[0] as keyof T;
                    const value = el[1];
                    const schema = validationSchema[name];
                    let isValid = true;
                    if (schema.validate instanceof RegExp) {
                        isValid = (schema.validate as RegExp).test(value);
                    }
                    if (typeof schema.validate === 'function') {
                        isValid = schema.validate(value);
                    }
                    if (isValid) return;
                    notValid = true;
                    prevState[name] = schema.errorMessage;
                });
                if (notValid) return prevState;
                return {...prevState};
            });
        });

        return () => {
            sub.unsubscribe()
        };
    }, [validationSchema]);

    return [errors, validationSubjectRef.current] as const;
};

export default useForm;
