import {FC, useCallback, useEffect, useRef, useState} from "react";
import * as React from "react";
import Option from './components/Option/index.js';
import VirtualizedDropdown from "./components/VirtualizedDropdown/index.js";
import {getValue} from "./utils.js";
import './styles.less';
import {TRect} from "../../hooks/useRefBoundingClientRect.js";


export interface ISelectChangeEvent {
    target: {
        value: string;
        name: string;
    }
}

type TOptionObject = {
    value: string;
    caption: string;
};
export type TOption = TOptionObject | string;

interface ISelectProps extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLDivElement>, HTMLDivElement>, 'onChange' | 'ref' | 'value'> {
    options: TOption[];
    onChange: (e: ISelectChangeEvent) => void;
    onClose?: () => void;
    multiple?: boolean;
    portal?: boolean;
    root?: Element | DocumentFragment
    value: string | undefined
    error?: boolean;
}

// TODO: support multiple values
const Select: FC<ISelectProps> = (
    {
        className,
        options = [],
        onChange,
        portal = true,
        placeholder,
        onClose,
        root,
        value,
        name,
        error,
        ...rest
    }
) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
    const [containerPosition, setContainerPosition] = useState<TRect>({
        bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0,
    });

    const valueRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const optionRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSelectedValue(value);
    }, [value])

    useEffect(() => {
        setTimeout(() => {
            if (!containerRef.current) return;

            setContainerPosition(containerRef.current.getBoundingClientRect());
        }, 100);
    }, [])

    useEffect(() => {
        let timeout: number;
        const dropdownPositionHandler = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (!containerRef.current) return;
                setContainerPosition(containerRef.current.getBoundingClientRect())
            }, 10);
        }
        window.addEventListener('resize', dropdownPositionHandler);

        return () => {
            window.removeEventListener('resize', dropdownPositionHandler)
            clearTimeout(timeout);
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const handleOutsideClick = (e: MouseEvent) => {
            const {target} = e;
            if (target instanceof Node && !containerRef.current?.contains(target)) {
                isVisible && onClose?.();
                setIsVisible(false);
            }
        };
        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        }
    }, [isVisible, onClose]);

    useEffect(() => {
        if (!valueRef.current) return;
        const value = valueRef.current;
        const handleEnterPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && document.activeElement === value) {
                setIsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleEnterPress);

        return () => {
            window.removeEventListener('keydown', handleEnterPress);
        }
    }, []);


    const handleClick = () => {
        setIsVisible(prevState => !prevState);
    };

    const handleOptionClick = useCallback((option: string) => {
        setSelectedValue(option);
        setIsVisible(false);
        onChange({
           target: {
               value: option,
               name: name || '',
           }
        });
    }, [name, onChange]);

    return (
        <div ref={containerRef} className={`b-select ${className || ''}`} {...rest} onClick={handleClick}>
            <div
                ref={valueRef}
                tabIndex={0}
                className={`b-select__value b-inputtext__value ${error && 'error'}`}
            >
                {getValue('caption', selectedValue) || <span className='b-select__value-placeholder'>{placeholder}</span>}
            </div>
            <VirtualizedDropdown
                visible={isVisible}
                portal={portal}
                containerPosition={containerPosition}
                dropUp
                onClick={handleClick}
                itemHeight={optionRef.current?.clientHeight || 42}
                root={root}
            >
                {options.map((el) => (
                    <Option
                        key={getValue('value', el)}
                        value={el}
                        onClick={handleOptionClick}
                    />
                ))}
            </VirtualizedDropdown>
            <input ref={inputRef} className={'dn'} type="radio" name={name} value={selectedValue} onChange={(e) => onChange(e)}/>
            <div ref={optionRef} className="b-dropdown__option dn"></div>
        </div>
    );
};

export default Select;
