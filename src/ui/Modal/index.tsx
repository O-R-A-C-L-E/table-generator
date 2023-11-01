import {FC, ReactElement, ReactNode, useLayoutEffect} from "react";
import {createPortal} from "react-dom";
import ModalUi from "./ModalUi.js";
import './styles.less';

type TModalProps = {
    children: ReactElement;
    visible: boolean;
    onHide: () => void;
    masked?: boolean;
    footer?: TTemplate;
    header?: TTemplate;
    root?: Element | DocumentFragment;
    hideOnEsc?: boolean
};
type TTemplate = ((props: TModalUiProps) => ReactNode) | ReactNode;
export type TModalUiProps = Omit<TModalProps, 'visible' | 'root'>;

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
    const container = root || document.body;


    useLayoutEffect(() => {
        if (!hideOnEsc) return;
        const handleHideOnEsc = (e:KeyboardEvent) => {
            if (e.code === 'Escape' || e.key === 'Escape') onHide();
        };
        window.addEventListener('keydown', handleHideOnEsc);

        return () => {
            window.removeEventListener('keydown', handleHideOnEsc);
        }
    }, [hideOnEsc, onHide]);

    if (visible) return createPortal(<ModalUi {...rest} onHide={onHide} children={children}/>, container);

    return null;
};

export default Modal;
