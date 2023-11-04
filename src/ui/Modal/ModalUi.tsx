import {TModalUiProps} from './Modal.js';
import {FC, ReactNode} from 'react';

type TTemplateName = 'footer' | 'header';
const ModalUi: FC<TModalUiProps> = (props) => {
    const renderTemplate = (name: TTemplateName): ReactNode => {
        if (!props[name]) return null;
        const template = props[name];
        if (typeof template === 'function') {
            return template(props);
        } else {
            return template;
        }
    };

    return (
        <div data-testid={'Modal'} className={`b-modal__container ${props.className || ''}`}>
            {props.masked && <div className="b-modal__mask"></div>}
            <div className={`b-modal`}>
                {props.hideButton && <div onClick={props.onHide} className="b-modal__hide-button"></div>}
                {props.header && (
                    <div className="b-modal__header">{renderTemplate('header')}</div>
                )}
                <div className="b-modal__content">{props.children}</div>
                {props.footer && (
                    <div className="b-modal__footer">{renderTemplate('footer')}</div>
                )}
            </div>
        </div>
    );
};

export default ModalUi;
