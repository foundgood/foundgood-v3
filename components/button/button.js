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
    iconType,
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
    const isIconOnly = Icon && iconPosition === 'center';

    const styles = {
        size: {
            medium: 't-h4 pt-11 px-16 py-6 rounded-4 focus:ring-3',
            small: 't-h6 pt-11 px-16 py-6 rounded-4 focus:ring-2 h-40',
        },
        theme: {
            blue: {
                shared: 'focus:ring-blue-100',
                primary:
                    'text-blue-10 bg-blue-300 hover:bg-blue-200 active:bg-blue-80 active:text-blue-40 focus:bg-blue-200 disabled:bg-blue-60 disabled:text-blue-40',
                secondary:
                    'bg-blue-10 text-blue-300 hover:bg-blue-20 hover:text-blue-200 active:bg-blue-40 active:text-blue-80 focus:bg-blue-20 focus:text-blue-200 disabled:bg-blue-40 disabled:text-blue-60',
                tertiary:
                    'bg-transparent text-blue-300 hover:text-blue-200 active:text-blue-80 focus:text-blue-200 disabled:text-blue-60',
                quaternary:
                    'ring-2 ring-blue-100 bg-transparent text-blue-100 hover:ring-blue-300 hover:text-blue-300 active:text-blue-80 focus:text-blue-300 disabled:ring-blue-60 disabled:text-blue-60',
            },
            teal: {
                shared: 'focus:ring-teal-120',
                primary:
                    'text-teal-10 bg-teal-80 hover:bg-teal-300 active:bg-teal-80 active:text-teal-40 focus:bg-teal-300 disabled:bg-teal-60 disabled:text-teal-40',
                secondary:
                    'bg-teal-10 text-teal-100 hover:bg-teal-20 hover:text-teal-300 active:bg-teal-40 active:text-teal-80 focus:bg-teal-20 focus:text-teal-300 disabled:bg-teal-40 disabled:text-teal-60',
                tertiary:
                    'bg-transparent text-teal-100 hover:text-teal-300 active:text-teal-80 focus:text-teal-300 disabled:text-teal-60',
                quaternary:
                    'ring-2 ring-teal-100 bg-transparent text-teal-100 hover:ring-teal-300 hover:text-teal-300 active:text-teal-80 focus:text-teal-300 disabled:ring-teal-60 disabled:text-teal-60',
            },
            coral: {
                shared: 'focus:ring-coral-100',
                primary:
                    'text-coral-120 bg-coral-200 hover:bg-coral-300 active:bg-coral-60 focus:bg-coral-200 disabled:bg-coral-60 disabled:text-coral-40',
                secondary:
                    'bg-coral-20 text-coral-100 hover:text-coral-300 active:bg-coral-40 active:text-coral-80 focus:bg-coral-20 focus:text-coral-300 disabled:bg-coral-20 disabled:text-coral-40',
                tertiary:
                    'bg-transparent text-coral-100 hover:text-coral-300 active:text-coral-80 focus:text-coral-300 disabled:text-coral-40',
                quaternary:
                    'ring-2 ring-coral-100 bg-transparent text-coral-100 hover:ring-coral-300 hover:text-coral-300 active:text-coral-80 focus:text-coral-300 disabled:ring-coral-60 disabled:text-coral-60',
            },
            amber: {
                shared: 'focus:ring-amber-100',
                primary:
                    'text-amber-120 bg-amber-200 hover:bg-amber-300 active:bg-amber-60 focus:bg-amber-200 disabled:bg-amber-60 disabled:text-amber-40',
                secondary:
                    'bg-amber-20 text-amber-100 hover:text-amber-300 active:bg-amber-40 active:text-amber-80 focus:bg-amber-20 focus:text-amber-300 disabled:bg-amber-20 disabled:text-amber-40',
                tertiary:
                    'bg-transparent text-amber-100 hover:text-amber-300 active:text-amber-80 focus:text-amber-300 disabled:text-amber-40',
                quaternary:
                    'ring-2 ring-amber-100 bg-transparent text-amber-100 hover:ring-amber-300 hover:text-amber-300 active:text-amber-80 focus:text-amber-300 disabled:ring-amber-60 disabled:text-amber-60',
            },
        },
    };

    // Styling
    const elementClassNames = cc([
        'transition-default flex items-center focus:outline-none outline-none whitespace-no-wrap flex-shrink-0',
        className,
        styles.size[size],
        styles.theme[theme].shared,
        styles.theme[theme][variant],
        {},
    ]);

    // Content
    const content = (
        <>
            {Icon && (
                <Icon
                    className={cc([
                        '-mt-6',
                        {
                            'fill-current': iconType === 'fill',
                            'stroke-current': iconType === 'stroke',
                            'mr-8 -ml-4': isIconLeft,
                            'ml-8 -mr-4 order-2': isIconRight,
                            'w-24 h-24': isIconOnly,
                        },
                    ])}
                />
            )}
            <span
                className={cc('flex-shrink-0', [
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
                action === 'fake' ? (
                    <div className={cc(['cursor-pointer', elementClassNames])}>
                        {content}
                    </div>
                ) : (
                    <Link href={action}>
                        <a
                            href={action}
                            className={elementClassNames}
                            target={blank ? '_blank' : '_self'}
                            rel={blank ? 'noreferrer noopener' : ''}>
                            {content}
                        </a>
                    </Link>
                )
            ) : (
                <button
                    disabled={disabled}
                    onClick={event => {
                        event.stopPropagation();
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
    iconPosition: t.oneOf(['right', 'left', 'center']),
    /* Icon stroke or fill */
    iconType: t.oneOf(['stroke', 'fill']),
    /* Button size */
    size: t.oneOf(['small', 'medium']),
    /* Button variant */
    variant: t.oneOf(['primary', 'secondary', 'tertiary', 'quaternary']),
    /* Theme */
    theme: t.oneOf(['blue', 'teal', 'coral', 'amber']),
};

ButtonComponent.defaultProps = {
    action: '#',
    blank: false,
    disabled: false,
    icon: null,
    iconPosition: 'left',
    iconType: 'fill',
    size: 'small',
    variant: 'primary',
    theme: 'blue',
    className: '',
};

export default ButtonComponent;
