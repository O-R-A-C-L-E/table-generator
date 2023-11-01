import {CSSProperties, FC, ReactElement, useLayoutEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import * as React from "react";
import './styles.less';
import useRefBoundingClientRect, {TRect} from "../../../../hooks/useRefBoundingClientRect.js";
import {scrollThrottle} from "../../utils.js";

type TDropdownProps = {
    root?: Element | DocumentFragment;
    portal?: boolean
    containerPosition?: TRect;
    itemHeight: number
    multiple?: boolean;
    visible: boolean;
    onClick: () => void;
    className?: string;
    dropUp?: boolean;
    height?: number;
    virtualizationStart?: number;
    children: ReactElement[];
};

const bufferedItems = 2;

const VirtualizedDropdown: FC<TDropdownProps> = (
    {
        root,
        portal,
        containerPosition,
        children,
        visible,
        className,
        itemHeight,
        dropUp = false,
        virtualizationStart = 500,
    }
) => {
    const [shouldDropUp, setShouldDropUp] = useState(dropUp);
    const portalContainer = root || document.body;
    const dropdownRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const dropdownPositionHandler = () => {
            if (!dropdownRef.current) return;
            if (!containerPosition) return;
            const dropdownRect = dropdownRef.current.getBoundingClientRect();
            dropdownRef.current.style.left = `${containerPosition.left}px`;
            dropdownRef.current.style.right = `${containerPosition.right}px`;
            const windowHeight = window.innerHeight;
            const dropdownHeight = Math.min(dropdownRect.height, (children.length * itemHeight));
            const spaceBelow = windowHeight - containerPosition.bottom;
            const shouldDropUp = spaceBelow < dropdownHeight

            if (shouldDropUp) {
                dropdownRef.current.style.bottom = `${(containerPosition?.top || 0) + (containerPosition?.height || 0) + dropdownHeight + 5}px`;
            } else {
                dropdownRef.current.style.top = `${(containerPosition?.top || 0) + (containerPosition?.height || 0) + 5}px`;
            }
            setShouldDropUp(shouldDropUp);
        }
        window.addEventListener('scroll', dropdownPositionHandler);
        window.addEventListener('resize', dropdownPositionHandler);

        return () => {
            window.removeEventListener('scroll', dropdownPositionHandler)
            window.removeEventListener('resize', dropdownPositionHandler)
        }
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
            className={`b-dropdown ${className || ''} slide-down-animate`}>
            {/*{multiple && <div className="b-dropdown__selected-items-container">{renderMultipleSelectedOption()}</div>}*/}
            {<VirtualizedList
                virtualizationStart={virtualizationStart}
                itemHeight={itemHeight}
            >
                {children}
            </VirtualizedList>}
        </div>;
    };

    if (portal) {
        return visible && createPortal(renderDropdown(), portalContainer);
    } else {
        return visible && renderDropdown();
    }
};

export type TVirtualizedList = {
    itemHeight: number
    virtualizationStart: number;
    children: ReactElement[];
}

const VirtualizedList: FC<TVirtualizedList> = (
    {
        itemHeight,
        virtualizationStart,
        children,
    }
) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [optionsContainerRect, optionsContainerRef] = useRefBoundingClientRect();

    const onScroll = React.useMemo(() => {
        return scrollThrottle((e) => {
            setScrollTop(e.currentTarget.scrollTop);
        }, 10);
    }, []);

    const visibleChildren = React.useMemo(() => {
        if (children.length < virtualizationStart)
            return children.map((child, index) =>
                React.cloneElement(child, {
                    style: {
                        position: "absolute",
                        top: index * itemHeight + index,
                        height: itemHeight,
                        left: 0,
                        right: 0,
                        lineHeight: `${itemHeight}px`
                    }
                })
            );
        const startIndex = Math.max(
            Math.floor(scrollTop / itemHeight) - bufferedItems,
            0
        );
        const endIndex = Math.min(
            Math.ceil((scrollTop + optionsContainerRect.height) / itemHeight - 1) +
            bufferedItems,
            children.length - 1
        );

        return children.slice(startIndex, endIndex + 1).map((child, index) =>
            React.cloneElement(child, {
                style: {
                    position: "absolute",
                    top: (startIndex + index) * itemHeight + index,
                    height: itemHeight,
                    left: 0,
                    right: 0,
                    lineHeight: `${itemHeight}px`
                }
            })
        );
    }, [children, optionsContainerRect.height, itemHeight, scrollTop, virtualizationStart]);

    return (
        <div
            onScroll={onScroll}
            ref={optionsContainerRef}
            style={{height: `${children.length * (itemHeight + bufferedItems)}px`}}
            className={`b-dropdown__options-container ${children.length >= virtualizationStart ? 'b-dropdown__options-container--fixed-height' : ''}`}>
            {visibleChildren}
        </div>
    )
}

export default VirtualizedDropdown;
