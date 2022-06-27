// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities

// Components

const SectionComponent = ({ name, theme = 'teal' }) => {
    // ///////////////////
    // THEMING
    // ///////////////////

    const isBlue = theme === 'blue';
    const isTeal = theme === 'teal';

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <div
            className={cc([
                'border-t-[3px] !-mb-16',
                {
                    '!-mb-10': !name,
                    'border-teal-10': isTeal,
                    'border-blue-10': isBlue,
                },
            ])}>
            {name && (
                <h4
                    className={cc([
                        't-h4 pt-18',
                        {
                            'text-teal-100': isTeal,
                            'text-blue-100': isBlue,
                        },
                    ])}>
                    {name}
                </h4>
            )}
        </div>
    );
};

SectionComponent.propTypes = {
    name: t.string,
    theme: t.oneOf(['teal', 'blue']),
};

SectionComponent.defaultProps = {
    label: '',
    theme: 'teal',
};

export default SectionComponent;
