import {CSSProperties, FC, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import './styles.less';
import VirtualizedList from '@/ui/VirtualizedList/VirtualizedList.js';
import {TDropdownProps} from '@/types/ui/VirtualizedDropdown.js';



const VirtualizedDropdown: FC<TDropdownProps> = (
    {
        root,
        portal,
        containerPosition,
        children,
        visible,
        className,
        itemHeight,
    }
) => {
    const [shouldDropUp, setShouldDropUp] = useState(false);
    const portalContainer = root || document.body;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!dropdownRef.current) return;
        if (!containerPosition) return;
        const dropdownRect = dropdownRef.current.getBoundingClientRect();
        dropdownRef.current.style.left = `${containerPosition.left}px`;
        dropdownRef.current.style.right = `${containerPosition.right}px`;
        const windowHeight = window.innerHeight;
        const dropdownHeight = Math.min(dropdownRect.height, (children.length * itemHeight));
        const spaceBelow = windowHeight - containerPosition.bottom;
        const shouldDropUp = spaceBelow < dropdownHeight;

        if (shouldDropUp) {
            dropdownRef.current.style.bottom = `${(containerPosition?.top || 0) + (containerPosition?.height || 0) + dropdownHeight + 5}px`;
        } else {
            dropdownRef.current.style.top = `${(containerPosition?.top || 0) + (containerPosition?.height || 0) + 5}px`;
        }
        setShouldDropUp(shouldDropUp);
    }, [children.length, containerPosition, itemHeight]);


    const getDropdownPosition = () => {
        const res: Pick<CSSProperties, 'top' | 'left' | 'right' | 'bottom'> = {
            left: `${containerPosition?.left || 0}px`,
            right: `${containerPosition?.right || 0}px`,
            top: 0,
        };
        if (shouldDropUp) {
            res.top = `${(containerPosition?.y || 0) + (containerPosition?.height || 0) + 5}px`;
        } else {
            res.top = `${(containerPosition?.y || 0) + (containerPosition?.height || 0) + 5}px`;
        }
        return res;
    };

    const renderDropdown = () => {
        return <div
            ref={dropdownRef}
            style={{width: `${containerPosition?.width || 0}px`, ...getDropdownPosition()}}
            data-testid={portal ? 'PortalDropdown' : 'Dropdown'}
            className={`b-dropdown ${className || ''} slide-down-animate`}>
            <VirtualizedList
                className={'b-dropdown__options-container'}
                virtualizationOn={children.length >= 100}
                virtualizationClassName={'b-dropdown__options-container--fixed-height'}
                itemHeight={itemHeight}
            >
                {children}
            </VirtualizedList>
        </div>;
    };

    if (!visible) return  null
    return portal ? createPortal(renderDropdown(), portalContainer) : renderDropdown();
};

export default VirtualizedDropdown;
