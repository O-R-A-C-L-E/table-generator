import {FC, MouseEventHandler, useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Composition, IOptionProps, ISelectProps} from '@/types/ui/Select.js';
import VirtualizedDropdown from './components/VirtualizedDropdown/VirtualizedDropdown.js';
import {TRect} from '@/hooks/useRefBoundingClientRect.js';
import {getValue} from './utils.js';
import './styles.less';

// TODO: support multiple values
const Select: FC<ISelectProps> & Composition = (
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
    const [containerPosition, setContainerPosition] = useState<TRect>({
        bottom: 0, height: 0, left: 0, right: 0, top: 0, width: 0, x: 0, y: 0,
    });
    const valueRef = useRef<HTMLDivElement>(null);
    const optionRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!valueRef.current) return;

        setContainerPosition(valueRef.current.getBoundingClientRect());
    }, []);

    useLayoutEffect(() => {
        let timeout: number;
        const dropdownPositionHandler = () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                if (!valueRef.current) return;
                setContainerPosition(valueRef.current.getBoundingClientRect());
            }, 10);
        };
        window.addEventListener('resize', dropdownPositionHandler);
        window.addEventListener('scroll', dropdownPositionHandler);

        return () => {
            window.removeEventListener('resize', dropdownPositionHandler);
            window.removeEventListener('scroll', dropdownPositionHandler);
            clearTimeout(timeout);
        };
    }, []);

    useLayoutEffect(() => {
        if (!valueRef.current) return;
        const handleOutsideClick = (e: MouseEvent) => {
            const {target} = e;
            if (target instanceof Node && !valueRef.current?.contains(target)) {
                setIsVisible(false);
                onClose?.();
            }
        };
        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
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
        };
    }, []);

    const getContainerPosition = () => {
        return valueRef.current?.getBoundingClientRect() || containerPosition;
    };


    const handleClick = useCallback(() => {
        setIsVisible(prevState => !prevState);
    }, []);

    const handleOptionClick = useCallback((option: string) => {
        setIsVisible(prevState => !prevState);
        onChange({
            target: {
                value: option,
                name: name || '',
            }
        });
    }, [name, onChange]);

    return (
        <div
            className={`b-select ${className || ''} ${error && 'error'}`}
            data-testid="Select-component"
            {...rest}
        >
            <div
                ref={valueRef}
                onClick={handleClick}
                data-testid="Select-component-value"
                tabIndex={0}
                className={`b-select__value b-inputtext__value`}
            >
                {getValue('caption', value) || <span className="b-select__value-placeholder">{placeholder}</span>}
            </div>
            <VirtualizedDropdown
                visible={isVisible}
                portal={portal}
                containerPosition={getContainerPosition()}
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
            <select className={'dn'} name={name} defaultValue={value} placeholder={placeholder}>
                <option value={value}></option>
            </select>
            <div ref={optionRef} className="b-dropdown__option dn"></div>
        </div>
    );
};

const Option: FC<IOptionProps> = (
    {
        value,
        onClick,
        deletable,
        ...rest
    }
) => {
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
        };
    }, [deletable, onClick, value]);


    return (
        <div
            tabIndex={0}
            className="b-select__option"
            data-testid={'Select-option'}
            onClick={handleClick}
            role={'option'}
            data-option-value={getValue('value', value)}
            {...rest}
        >
            {getValue('caption', value)}
        </div>
    );
};

Select.Option = Option;
export default Select;
