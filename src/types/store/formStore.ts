export type TFormStateError = {
    error?: string;
    touched?: string;
    isValid?: boolean;
}

export type TFormStateValues = {
    name: string;
    surname: string;
    age: string;
    city: string;
}

export type TFormStateErrors = {
    [K in keyof TFormStateValues]?: TFormStateError
};

export type TFormState = {
    values: TFormStateValues;
    errors: TFormStateErrors;
};
