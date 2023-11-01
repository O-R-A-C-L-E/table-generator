export type TValidateFunction = ((value: string | number) => boolean);
export type TValidatePattern = {
    value: RegExp,
    message: string
}
export type TValidationOptionsKey = 'pattern' | string;
export type TValidationOptions = {
    [key: TValidationOptionsKey]: TValidatePattern | TValidateFunction;
}
export type TRegisterData = {
    value: string;
    onChange: () => void
    onBlur: () => void;
}
export type TRegisterFunction<T> = (inputName: keyof T, validationOptions: TValidationOptions) => TRegisterData;

export type TValidationSchemaItem = {
    validate: RegExp | TValidateFunction;
    errorMessage: string;
}

export type TValidationSchema<T> = {
    [k in keyof T]: TValidationSchemaItem;
}
