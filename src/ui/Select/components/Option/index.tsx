import {TOption} from "../../index.js";
import React, {FC, MouseEventHandler, useEffect, useRef} from "react";
import {getValue} from "../../utils.js";

interface IOptionProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onClick' | 'ref' | 'value'> {
    onClick?: (option: string) => void;
    value: TOption;
    deletable?: (option: TOption) => void;
}

const Option: FC<IOptionProps> = ({value, onClick, deletable, ...rest}) => {
    const optionElementRef = useRef<HTMLDivElement>(null);

    const handleClick: MouseEventHandler<HTMLDivElement> = () => {
        const v = getValue('value', value);
        if (!v) return;
        deletable && deletable(v);
        onClick && onClick(v);
    };

    useEffect(() => {
        const handleEnterPress = (e: KeyboardEvent) => {
            if (e.key !== 'Enter' && document.activeElement !== optionElementRef.current) return;
            const v = getValue('value', value);
            if (!v) return;
            deletable && deletable(v);
            onClick && onClick(v);
        };

        window.addEventListener('keydown', handleEnterPress);

        return () => {
            window.removeEventListener('keydown', handleEnterPress);
        }
    }, [deletable, onClick, value]);


    return (
        <div
            tabIndex={0}
            className="b-select__option"
            onClick={handleClick}
            role={'option'}
            data-option-value={getValue('value', value)}
            {...rest}
        >
            {getValue('caption', value)}
        </div>
    )
};

export default Option;
