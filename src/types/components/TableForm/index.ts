import {TFormStateValues} from '@/types/store/formStore.ts';

export type TTableFormProps = {
    initialValue?: TFormStateValues;
    buttonText: string;
    onSubmit?: (formState: TFormStateValues) => void;
    shouldSubscribe?: boolean;
    className?: string;
    validateOnTouch?: boolean
    type: string;
}
