// React
import React, { Children } from 'react';

// Packages
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Utilities

// Components

const ComponentSelectorWrapperComponent = ({
    children,
    controller,
    name,
    defaultValue,
}) => {
    // Only one child
    const child = Children.only(children);

    return child ? (
        <Controller
            control={controller}
            defaultValue={defaultValue}
            name={name}
            render={({ field: { onChange, value } }) =>
                React.cloneElement(child, {
                    selected: value,
                    onChange,
                    reflectionMode: true,
                })
            }
        />
    ) : null;
};

ComponentSelectorWrapperComponent.propTypes = {
    name: t.string,
    defaultValue: t.bool,
};

ComponentSelectorWrapperComponent.defaultProps = {
    defaultValue: false,
};

export default ComponentSelectorWrapperComponent;
