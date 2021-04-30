// React
import React from 'react';

// Packages
import t from 'prop-types';
import cc from 'classcat';

const IconButtonComponent = ({
    action,
    icon: Icon,
    iconType,
    className,
    theme,
}) => {
    const styles = {
        blue: 'text-blue-300 focus:ring-blue-100',
        teal: 'text-teal-300 focus:ring-teal-100',
        coral: 'text-coral-300 focus:ring-coral-100',
        amber: 'text-amber-300 focus:ring-amber-100',
    };

    return (
        <button
            onClick={() => {
                action();
            }}
            className={cc([
                'outline-none focus:outline-none focus:ring-2 rounded-4',
                styles[theme],
                className,
            ])}>
            <Icon
                className={cc([
                    'w-24 h-24',
                    {
                        'fill-current': iconType === 'fill',
                        'stroke-current': iconType === 'stroke',
                    },
                ])}
            />
        </button>
    );
};

IconButtonComponent.propTypes = {
    /* Defines what happens when clicking. Navigate to url (string) or call method (function). */
    action: t.func.isRequired,
    /* Adds additional class names */
    className: t.string,
    /* Icon - should be component */
    icon: t.elementType.isRequired,
    /* Icon stroke or fill */
    iconType: t.oneOf(['stroke', 'fill']),
    /* Theme */
    theme: t.oneOf(['blue', 'teal', 'coral', 'amber']),
};

IconButtonComponent.defaultProps = {
    action: '#',
    icon: null,
    theme: 'blue',
    iconType: 'fill',
    className: '',
};

export default IconButtonComponent;
