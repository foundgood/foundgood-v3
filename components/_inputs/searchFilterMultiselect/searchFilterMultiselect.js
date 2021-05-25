// React
import React, { useState, useEffect, useRef } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';

// Utilities

// Components

// Icons
import { FiCircle, FiCheckCircle, FiX } from 'react-icons/fi';

const SearchFilterMultiselectComponent = ({
    controller,
    label,
    name,
    options,
}) => {
    // Local state
    const [listWrapper, toggleListWrapper] = useState(false);

    // Ref: Mobile navigation wrapper
    const listWrapperRef = useRef(null);

    // Effect: Catch outside clicks and close
    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [listWrapper]);

    // Function: Event wrapper for closing outside click
    function handleClick(event) {
        if (
            listWrapper &&
            listWrapperRef.current &&
            !listWrapperRef.current.contains(event.target)
        ) {
            toggleListWrapper(false);
        }
    }

    // Controller from useForm
    const {
        field: { onChange, value },
    } = useController({
        name,
        defaultValue: [],
        control: controller,
    });

    // Method: Returns list without item based on value
    function toggleItemFromValues(item) {
        // Check for item in list
        const itemExists = value.includes(item.value);

        // Remove
        if (itemExists) {
            return [...value.filter(valueItem => item.value !== valueItem)];
        }

        // Add
        return [...value, item.value];
    }

    return (
        <div className="relative flex m-8">
            <button
                className={cc([
                    'py-6 text-left text-blue-300 outline-none pt-11 focus:ring-2 bg-blue-20 t-small focus:ring-blue-100 focus:outline-none',
                    {
                        'rounded-l-4 pr-8 pl-16': value.length > 0,
                        'rounded-4 px-16': value.length === 0,
                    },
                ])}
                onClick={event => {
                    event.preventDefault();
                    toggleListWrapper(!listWrapper);
                }}>
                {`${label} `}
                <span className="font-bold">
                    {value.length > 0
                        ? value
                              .map(v => options.find(o => v === o.value).label)
                              .join(', ')
                        : '...'}
                </span>
            </button>
            {value.length > 0 && (
                <button
                    onClick={() => onChange([])}
                    className="pl-8 pr-16 text-blue-300 outline-none focus:ring-2 bg-blue-20 t-small focus:ring-blue-100 focus:outline-none rounded-r-4">
                    <FiX />
                </button>
            )}
            <div
                ref={listWrapperRef}
                className={cc([
                    'absolute flex flex-col p-16 pr-64 mt-8 space-y-16 text-blue-300 t-h6 bg-blue-20 top-full rounded-4 z-above transition-default',
                    {
                        'opacity-100 pointer-events-auto': listWrapper,
                        'opacity-0 pointer-events-none': !listWrapper,
                    },
                ])}>
                {options.map(item => (
                    <button
                        key={item.value}
                        onClick={event => {
                            event.preventDefault();
                            // Get new values list
                            const newList = toggleItemFromValues(item);
                            onChange(newList);
                        }}
                        className={cc([
                            'flex whitespace-nowrap items-center space-x-8 text-left outline-none focus:outline-none',
                            {
                                'text-blue-100': value.includes(item.value),
                            },
                        ])}>
                        {value.includes(item.value) ? (
                            <FiCheckCircle className="pointer-events-none" />
                        ) : (
                            <FiCircle className="pointer-events-none" />
                        )}
                        <span className="mt-4">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

SearchFilterMultiselectComponent.propTypes = {
    name: t.string,
    options: t.arrayOf(
        t.shape({
            label: t.string,
            value: t.oneOfType([t.string, t.number, t.bool]),
        })
    ),
};

SearchFilterMultiselectComponent.defaultProps = {
    options: [],
};

export default SearchFilterMultiselectComponent;
