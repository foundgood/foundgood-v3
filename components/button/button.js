// React
import React from 'react';

// Next
import Link from 'next/link';

// Packages
import t from 'prop-types';
import cc from 'classcat';

const ButtonComponent = ({
    children,
    action,
    blank,
    disabled,
    icon: Icon,
    iconPosition,
    size,
    variant,
    className,
    theme,
}) => {
    // Action
    const event = typeof action === 'string' ? 'url' : 'method';

    // Icon position
    const isIconLeft = Icon && iconPosition === 'left';
    const isIconRight = Icon && iconPosition === 'right';

    const styles = {
        size: {
            medium: 't-h4 pt-11 px-16 py-6 rounded-4 focus:ring-3',
            small: 't-h6 pt-11 px-16 py-6 rounded-4 focus:ring-2',
        },
        theme: {
            blue: {
                primary:
                    'text-blue-10 bg-blue-300 hover:bg-blue-200 active:bg-blue-80 active:text-blue-40 focus:bg-blue-200 focus:ring-blue-300 disabled:bg-blue-60 disabled:text-blue-40',
                secondary: '',
                tertiary: 'bg-transparent',
            },
            teal: {
                primary:
                    'text-blue-10 bg-blue-300 hover:bg-blue-200 active:bg-blue-80 active:text-blue-40 focus:bg-blue-200 focus:ring-blue-300 disabled:bg-blue-60 disabled:text-blue-40',
                secondary: '',
                tertiary: 'bg-transparent',
            },
            coral: {
                primary:
                    'text-blue-10 bg-blue-300 hover:bg-blue-200 active:bg-blue-80 active:text-blue-40 focus:bg-blue-200 focus:ring-blue-300 disabled:bg-blue-60 disabled:text-blue-40',
                secondary: '',
                tertiary: 'bg-transparent',
            },
            amber: {
                primary:
                    'text-blue-10 bg-blue-300 hover:bg-blue-200 active:bg-blue-80 active:text-blue-40 focus:bg-blue-200 focus:ring-blue-300 disabled:bg-blue-60 disabled:text-blue-40',
                secondary: '',
                tertiary: 'bg-transparent',
            },
        },
    };

    // Styling
    const elementClassNames = cc([
        'transition-default flex items-center focus:outline-none outline-none whitespace-no-wrap',
        className,
        styles.size[size],
        styles.theme[theme][variant],
        {},
    ]);

    // Content
    const content = (
        <>
            {Icon && (
                <Icon
                    className={cc([
                        'fill-current -mt-6',
                        {
                            'mr-8 -ml-4': isIconLeft,
                            'ml-8 -mr-4 order-2': isIconRight,
                        },
                    ])}
                />
            )}
            <span
                className={cc([
                    {
                        'order-1': isIconRight,
                    },
                ])}>
                {children}
            </span>
        </>
    );

    return (
        <>
            {event === 'url' ? (
                <Link href={action}>
                    <a
                        href={action}
                        className={elementClassNames}
                        target={blank ? '_blank' : '_self'}
                        rel={blank ? 'noreferrer noopener' : ''}>
                        {content}
                    </a>
                </Link>
            ) : (
                <button
                    disabled={disabled}
                    onClick={event => {
                        event.preventDefault();
                        action();
                    }}
                    className={elementClassNames}>
                    {content}
                </button>
            )}
        </>
    );
};

ButtonComponent.propTypes = {
    /* Defines what happens when clicking. Navigate to url (string) or call method (function). */
    action: t.oneOfType([t.string, t.func]).isRequired,
    /* Blank is applicable if action is a url (string) */
    blank: t.bool,
    /* Adds additional class names */
    className: t.string,
    /* If the button should appear disabled */
    disabled: t.bool,
    /* Icon - should be component */
    icon: t.elementType,
    /* Placement of the icon */
    iconPosition: t.oneOf(['right', 'left']),
    /* Button size */
    size: t.oneOf(['small', 'medium']),
    /* Button variant */
    variant: t.oneOf(['primary', 'secondary', 'tertiary']),
    /* Theme */
    theme: t.oneOf(['blue', 'teal', 'coral', 'amber']),
};

ButtonComponent.defaultProps = {
    action: '#',
    blank: false,
    disabled: false,
    icon: null,
    iconPosition: 'left',
    size: 'medium',
    variant: 'primary',
    theme: 'blue',
    className: '',
};

export default ButtonComponent;
