import {TFormState} from "@/types/store/formStore.ts";

export type TTableFormProps = {
    initialValue?: TFormState;
    buttonText: string;
    onSubmit?: (formState: TFormState) => void;
    shouldSubscribe?: boolean;
    className?: string;
}
