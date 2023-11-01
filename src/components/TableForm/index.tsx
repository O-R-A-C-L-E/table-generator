import {FC, FormEvent} from "react";
import {getCities} from '@/utils/getCities.js';
import './styles.less';
import useObservableFormState from "@/hooks/useObservableFormState.ts";
import Form from "@/ui/Form/index.tsx";
import InputText from "@/ui/InputText/index.tsx";
import Select from "@/ui/Select/index.tsx";
import Button from "@/ui/Button/index.tsx";
import {TTableFormProps} from '@/types/components/TableForm/index.js';

const TableForm: FC<TTableFormProps> = (
    {
        buttonText,
        shouldSubscribe = true,
        initialValue,
        onSubmit,
        className,
    }
) => {
    const [formState, handleChange] = useObservableFormState(shouldSubscribe, initialValue);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit && onSubmit(formState);
    };


    return <Form className={`b-table-form ${className || ''}`} onSubmit={handleSubmit}>
        <div className='b-table-form__row'>
            <InputText
                name='name'
                value={formState.name}
                onChange={handleChange}
                placeholder='Name'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
        </div>
        <div>
            <InputText
                name='surname'
                value={formState.surname}
                onChange={handleChange}
                placeholder='Surname'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
        </div>
        <div>
            <InputText
                type='number'
                name='age'
                value={formState.age}
                onChange={handleChange}
                placeholder='Age'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
        </div>
        <div>
            <Select
                name='city'
                options={getCities()}
                value={formState.city}
                onChange={handleChange}
                placeholder='City'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
                multiple={false}
            />
        </div>
        <Button className='b-table-form__form-submit' type='submit'>{buttonText}</Button>
    </Form>;
};

export default TableForm;
