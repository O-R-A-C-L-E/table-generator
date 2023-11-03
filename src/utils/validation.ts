import {getKeys} from '@/utils/getKeys.js';
import {TFormStateError} from '@/types/store/formStore.js';

export type TValidateFunction = ((value: string) => boolean | string);

export type TValidationSchemaItem = {
    validators?: TValidateFunction[];
    required?: boolean;
    error?: string;
    touched?: boolean;
    value?: string;
}

export type TValidationSchema<T> = Record<keyof T, TValidationSchemaItem>

export function validate<T extends object>(state:T, options?:TValidationSchema<T>) {
    return getKeys(state).reduce((prev, key) => {
        const value = state[key];
        prev[key] = {
            ...prev[key],
            touched: true,
            isValid: true,
        };

        if (options && options[key]) {
            if (options[key].required && !value) {
                prev[key] = {
                    ...prev[key],
                    error: 'Field is required',
                    isValid: false,
                }
            }

            if (Array.isArray(options[key].validators)) {
                const validateRes = options[key].validators?.map(fn => {
                    const res = fn(value as string);
                    return typeof res === 'string' && res || '';
                }).filter(el => el !== '');

                if (validateRes && validateRes.length) {
                    prev[key] = {
                        ...prev[key],
                        error: validateRes[0],
                        isValid: false,
                    }
                }
            }
        }
        if (prev[key].isValid) {
            delete prev[key].error;
        }

        return {...prev};
    }, {} as Record<keyof T, TFormStateError>);
}
