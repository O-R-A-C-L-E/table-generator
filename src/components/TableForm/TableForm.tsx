import {FC, FormEvent, ReactElement} from 'react';
import {getCities} from '@/utils/getCities.js';
import './styles.less';
import useObservableFormState from "@/components/TableForm/TableForm.hooks.ts";
import Form from "@/ui/Form/Form.tsx";
import InputText from "@/ui/InputText/InputText.tsx";
import Select from "@/ui/Select/Select.tsx";
import Button from "@/ui/Button/Button.tsx";
import {TTableFormProps} from '@/types/components/TableForm/TableForm.js';
import {getKeys} from '@/utils/getKeys.js';


const TableForm: FC<TTableFormProps> = (
    {
        buttonText,
        onSubmit,
        className,
        initialValue,
        type,
    }
):ReactElement => {
    const [{values, errors}, handleChange, handleFormSubmit] = useObservableFormState(type, initialValue);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit && onSubmit(values);
    };

    const getIsError = (field: keyof typeof errors) => Boolean(errors[field]?.touched && !errors[field]?.isValid);

    const getIsValid = () => {
        return getKeys(errors).filter(key => !errors[key]?.isValid).length === 0;
    };


    return <Form
        data-testid={'TableForm'}
        className={`b-table-form ${className || ''}`}
        onSubmit={handleFormSubmit(handleSubmit)}>
        <div className='b-table-form__row'>
            <InputText
                name='name'
                value={values.name}
                error={getIsError('name')}
                onChange={handleChange}
                placeholder='Name'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
            {errors.name?.touched && errors.name?.error && <div data-testid={'input-error-message'} className="b-table-form__error">{errors.name?.error || ''}</div>}
        </div>
        <div>
            <InputText
                name='surname'
                value={values.surname}
                error={getIsError('surname')}
                onChange={handleChange}
                placeholder='Surname'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
            {errors.surname?.touched && errors.surname?.error && <div data-testid={'input-error-message'} className="b-table-form__error">{errors.surname?.error}</div>}
        </div>
        <div>
            <InputText
                type='number'
                name='age'
                value={values.age}
                error={getIsError('age')}
                onChange={handleChange}
                placeholder='Age'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
            {errors.age?.touched && errors.age?.error && <div data-testid={'input-error-message'} className="b-table-form__error">{errors.age?.error}</div>}
        </div>
        <div>
            <Select
                name='city'
                options={getCities()}
                value={values.city}
                error={getIsError('city')}
                onChange={handleChange}
                placeholder='City'
                className={'b-table-form__form-control b-table-form__form-control--focus-hide-placeholder'}
            />
            {errors.city?.touched && errors.city?.error && <div data-testid={'input-error-message'} className="b-table-form__error">{errors.city?.error}</div>}
        </div>
        <Button disabled={!getIsValid()} data-testid={`TableForm--submit-${buttonText}`} className='b-table-form__form-submit' type='submit'>{buttonText}</Button>
    </Form>;
};

export default TableForm;
