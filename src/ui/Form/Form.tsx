import {ComponentPropsWithRef, FC, ReactElement} from "react";
import './styles.less';

interface IFormProps extends ComponentPropsWithRef<'form'> {
    children: ReactElement | ReactElement[];
}

const Form:FC<IFormProps> = ({children, className, ...rest}) => {

    return <form className={`b-form ${className || ''}`} {...rest}>{children}</form>
};

export default Form;
