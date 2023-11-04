import {FC, ReactElement, ReactNode, useLayoutEffect} from 'react';
import {createPortal} from 'react-dom';
import ModalUi from './ModalUi.js';
import './styles.less';
import {useDelayUnmount} from '@/hooks/useDelayUnmount.js';

type TModalProps = {
    children: ReactElement;
    visible: boolean;
    onHide: () => void;
    masked?: boolean;
    footer?: TTemplate;
    header?: TTemplate;
    root?: Element | DocumentFragment;
    hideOnEsc?: boolean
    hideButton?: boolean
};
type TTemplate = ((props: TModalUiProps) => ReactNode) | ReactNode;

export interface TModalUiProps extends Omit<TModalProps, 'visible' | 'root'> {
    className?: string;
}

const Modal: FC<TModalProps> = (
    {
        visible,
        root,
        children,
        hideOnEsc = true,
        onHide,
        ...rest
    }
) => {
    const shouldRender = useDelayUnmount(visible, 300);
    const container = root || document.body;

    useLayoutEffect(() => {
        if (!hideOnEsc) return;
        const handleHideOnEsc = (e: KeyboardEvent) => {
            if (e.code === 'Escape' || e.key === 'Escape') onHide();
        };
        window.addEventListener('keydown', handleHideOnEsc);

        return () => {
            window.removeEventListener('keydown', handleHideOnEsc);
        };
    }, [hideOnEsc, onHide]);

    if (shouldRender) {
        return createPortal(
            <ModalUi
                className={visible ? 'modal-show' : 'modal-hide'}
                {...rest}
                onHide={onHide}
                children={children}
            />, container);
    }

    return null;
};

export default Modal;
