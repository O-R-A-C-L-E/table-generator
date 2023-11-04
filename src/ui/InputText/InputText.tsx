import {ComponentPropsWithRef, FC} from "react";
import './styles.less';

interface IInputTextProps extends ComponentPropsWithRef<'input'> {
    error?: boolean;
}

const InputText: FC<IInputTextProps> = (
    {
        className,
        error,
        ...rest
    }
) => {

    return (
        <div className={`b-inputtext ${className || ''} ${error ? 'error' : ''}`}>
            <input
                className='b-inputtext__value'
                {...rest} />
        </div>
    )
};

export default InputText;
