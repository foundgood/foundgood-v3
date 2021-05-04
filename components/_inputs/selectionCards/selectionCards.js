// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Icons
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const SelectionCards = ({ controller, name, options }) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Local state
    const [list, setList] = useState(
        options.map(item => ({ ...item, selected: item.required }))
    );

    // Method: Returns list with new text value based on id
    function getUpdatedList(listIndex) {
        // Toggle in list
        return [
            ...list.map((listItem, index) =>
                index === listIndex
                    ? {
                          ...listItem,
                          selected: !listItem.selected,
                      }
                    : listItem
            ),
        ];
    }

    return (
        <div className="flex flex-col py-16 space-y-36">
            <Controller
                control={controller}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) =>
                    list.map((item, index) => {
                        return (
                            <button
                                key={item.value}
                                disabled={item.required}
                                onClick={event => {
                                    event.preventDefault();
                                    // Get new list
                                    const newList = getUpdatedList(index);

                                    // Update local state
                                    setList(newList);

                                    // Update form state
                                    onChange(newList);
                                }}
                                className="flex items-center outline-none focus:outline-none group">
                                <div
                                    className={cc([
                                        'flex flex-col text-teal-100 p-16 pr-0 group-focus:ring-2 group-focus:ring-teal-100 border-4 border-teal-20 rounded-4 transition-default',
                                        {
                                            '!border-teal-40': item.selected,
                                        },
                                    ])}>
                                    <div className="flex items-center space-x-12">
                                        <span className="t-sh4">
                                            {item.label}
                                        </span>
                                        <span className="px-8 pt-3 pb-1 t-sh7 bg-teal-20 rounded-4">
                                            {item.required
                                                ? labelTodo('Required')
                                                : labelTodo('Additional')}
                                        </span>
                                    </div>
                                    <p className="mt-8 text-left t-small">
                                        {item.details}
                                    </p>
                                </div>
                                <div className="ml-16 text-teal-300">
                                    {item.selected ? (
                                        <FiCheckCircle className="w-24 h-24 stroke-current" />
                                    ) : (
                                        <FiCircle className="w-24 h-24 stroke-current" />
                                    )}
                                </div>
                            </button>
                        );
                    })
                }
            />
        </div>
    );
};

SelectionCards.propTypes = {
    name: t.string,
    options: t.arrayOf(
        t.shape({
            label: t.string,
            value: t.oneOfType([t.string, t.number, t.bool]),
            details: t.string,
            required: t.bool,
        })
    ),
};

SelectionCards.defaultProps = {
    options: [],
};

export default SelectionCards;
