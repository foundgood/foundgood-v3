// React
import React, { Children } from 'react';

// Packages
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Utilities

// Components

// Icons
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

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
            render={({ field: { onChange, value } }) => (
                <div
                    className="flex items-center text-left outline-none cursor-pointer focus:outline-none group"
                    onClick={() => onChange(!value)}>
                    <div className="flex-grow">
                        {React.cloneElement(child, {
                            selected: value,
                        })}
                    </div>
                    <div className="ml-16 text-teal-300">
                        {value ? (
                            <FiCheckCircle className="w-24 h-24 stroke-current" />
                        ) : (
                            <FiCircle className="w-24 h-24 stroke-current" />
                        )}
                    </div>
                </div>
            )}
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
