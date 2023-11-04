import * as React from 'react';
import {FC, ReactElement, useState} from 'react';
import useRefBoundingClientRect from '@/hooks/useRefBoundingClientRect.js';
import {scrollThrottle} from '@/ui/Select/utils.js';

export type TVirtualizedList = {
    itemHeight: number
    virtualizationOn?: boolean;
    children: ReactElement[];
    className?: string;
    virtualizationClassName?: string;
    bufferedItems?: number;
}


const VirtualizedList: FC<TVirtualizedList> = (
    {
        itemHeight,
        children,
        virtualizationOn = children.length >= 100,
        virtualizationClassName,
        className,
        bufferedItems = 2,
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
        if (virtualizationOn) return children.map((child, index) =>
            React.cloneElement(child, {
                style: {
                    position: 'absolute',
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
                    position: 'absolute',
                    top: (startIndex + index) * itemHeight + index,
                    height: itemHeight,
                    left: 0,
                    right: 0,
                    lineHeight: `${itemHeight}px`
                }
            })
        );
    }, [virtualizationOn, children, scrollTop, itemHeight, bufferedItems, optionsContainerRect.height]);

    return (
        <div
            onScroll={onScroll}
            ref={optionsContainerRef}
            style={{height: `${children.length * (itemHeight + bufferedItems)}px`}}
            className={`b-virtualized-list ${className || ''} ${virtualizationOn ? virtualizationClassName || '' : ''}`}>
            {visibleChildren}
        </div>
    );
};

export default VirtualizedList;
