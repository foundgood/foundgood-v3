// React
import { useEffect, useState } from 'react';

// Packages
import { useWindowResize } from 'use-events';

// Utilities
import hasWindow from './../hasWindow';

const breakpoints = [
    { min: 0, max: 319, label: '2xs' },
    { min: 320, max: 413, label: 'xs' },
    { min: 414, max: 767, label: 'sm' },
    { min: 768, max: 1023, label: 'md' },
    { min: 1024, max: 1199, label: 'lg' },
    { min: 1200, max: 1439, label: 'xl' },
    { min: 1440, max: 1599, label: '2xl' },
    { min: 1600, max: 6000, label: '3xl' },
];

const getBreakpoint = width => {
    return breakpoints.filter(bp => width >= bp.min && bp.max >= width)[0];
};

const useResponsive = () => {
    const [width] = hasWindow() ? useWindowResize() : [1200];
    const [mq, setMq] = useState(getBreakpoint(width));
    const [bp, setBp] = useState(getBreakpoint(width).label);

    useEffect(() => {
        setMq(getBreakpoint(width));
    }, [width]);

    useEffect(() => {
        setBp(mq.label);
    }, [mq]);

    return bp;
};

export default useResponsive;
