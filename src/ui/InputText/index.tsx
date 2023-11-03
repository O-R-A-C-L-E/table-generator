import {ChangeEvent, ComponentPropsWithRef, FC, FocusEvent} from "react";
import './styles.less';

interface IInputTextProps extends ComponentPropsWithRef<'input'> {
    error?: boolean;
}

const InputText: FC<IInputTextProps> = (
    {
        className,
        value,
        onBlur,
        onChange,
        error,
        ...rest
    }
) => {

    const handleBlur = (e:FocusEvent<HTMLInputElement>) => {
        onBlur && onBlur(e);
    };

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e);
    }

    return (
        <div className={`b-inputtext ${className || ''} ${error ? 'error' : ''}`}>
            <input
                className='b-inputtext__value'
                value={value} onChange={handleChange} onBlur={handleBlur} {...rest} />
        </div>
    )
};

export default InputText;
