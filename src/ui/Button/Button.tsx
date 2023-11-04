import {ComponentPropsWithRef, FC, ReactElement} from "react";
import './styles.less';

type TVariant = 'primary' | 'danger' | 'outline' | 'link-primary' | 'link-danger';
interface IButtonTypes extends ComponentPropsWithRef<'button'> {
    children: ReactElement | string;
    variant?: TVariant;
}
const Button:FC<IButtonTypes> = ({children, className, variant, ...rest}) => {

    return <button className={`b-button b-button--${variant || 'primary'} ${className || ''}`} {...rest}>{children}</button>;
};

export default Button;
