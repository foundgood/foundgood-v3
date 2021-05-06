// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';
import { nanoid } from 'nanoid';

// Utilities
import { useMetadata } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icons
import { FiX, FiChevronDown } from 'react-icons/fi';

const SelectListComponent = ({
    controller,
    defaultValue,
    label,
    listMaxLength,
    maxLength,
    name,
    options,
    placeholder,
    selectLabel,
    showText,
    subLabel,
    textLabel,
}) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Local state
    const [list, setList] = useState(
        defaultValue.map(item => ({
            selectValue: item.selectValue,
            textValue: item.textValue ?? '',
            id: nanoid(),
        }))
    );

    // Method: Handles add to list
    function addToList() {
        setList([...list, { selectValue: '', textValue: '', id: nanoid() }]);
    }

    // Method: Returns list without item based on id
    function getListWithoutItem(id) {
        return [...list.filter(item => item.id !== id)];
    }

    // Method: Returns list with new select value based on id
    function getListWithNewSelectValue(id, selectValue) {
        return [
            ...list.map(item =>
                item.id === id ? { ...item, selectValue } : item
            ),
        ];
    }

    // Method: Returns list with new text value based on id
    function getListWithNewTextValue(id, textValue) {
        return [
            ...list.map(item =>
                item.id === id ? { ...item, textValue } : item
            ),
        ];
    }

    // Controller from useForm
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
        defaultValue: defaultValue,
    });

    // Update state when using setValue
    useEffect(() => {
        if (value) {
            setList(
                value.map(item => ({
                    selectValue: item.selectValue,
                    textValue: item.textValue ?? '',
                    id: nanoid(),
                }))
            );
        }
    }, []);

    return (
        <label className="flex flex-col" htmlFor={name}>
            {label && <span className="input-label">{label}</span>}
            {subLabel && (
                <span className="mt-8 input-sublabel">{subLabel}</span>
            )}
            <div className={cc(['flex flex-col', { 'mt-16': label }])}>
                <div className="flex flex-col space-y-12">
                    {list.map((item, index) => {
                        return (
                            <div key={item.id} className="flex flex-col">
                                <div className="flex space-x-4">
                                    {/* Select / Input */}
                                    <div className="flex w-full space-x-12">
                                        {/* Select */}
                                        <div className="flex flex-col w-full">
                                            {index === 0 && (
                                                <span className="mb-4 input-utility-text">
                                                    {selectLabel}
                                                </span>
                                            )}
                                            <div className="relative flex items-center">
                                                <select
                                                    className={cc([
                                                        'input-defaults flex-grow',
                                                        'appearance-none pr-20',
                                                        {
                                                            'ring-2 ring-coral-300 bg-coral-10 text-coral-300': error,
                                                        },
                                                    ])}
                                                    defaultValue={
                                                        item.selectValue
                                                    }
                                                    onChange={event => {
                                                        // Get next list
                                                        const nextList = getListWithNewSelectValue(
                                                            item.id,
                                                            event.target.value
                                                        );

                                                        // Update current list
                                                        setList(nextList);

                                                        // Update form
                                                        onChange(
                                                            nextList.filter(
                                                                item =>
                                                                    item
                                                                        .selectValue
                                                                        .length >
                                                                    0
                                                            )
                                                        );
                                                    }}>
                                                    <option
                                                        default
                                                        value=""
                                                        className="hidden">
                                                        {placeholder}
                                                    </option>
                                                    {options.map(option => (
                                                        <option
                                                            key={option.value}
                                                            value={option.value}
                                                            className="font-normal text-black">
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <FiChevronDown className="absolute right-0 mr-10 pointer-events-none stroke-current" />
                                            </div>
                                        </div>

                                        {/* Input */}
                                        {showText && (
                                            <div className="flex flex-col w-full">
                                                {index === 0 && (
                                                    <span className="mb-4 input-utility-text">
                                                        {textLabel}
                                                    </span>
                                                )}
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="text"
                                                        maxLength={
                                                            maxLength
                                                                ? maxLength
                                                                : 'none'
                                                        }
                                                        defaultValue={
                                                            item.textValue
                                                        }
                                                        placeholder={
                                                            placeholder
                                                        }
                                                        onChange={event => {
                                                            // Get next list
                                                            const nextList = getListWithNewTextValue(
                                                                item.id,
                                                                event.target
                                                                    .value
                                                            );

                                                            // Update current list
                                                            setList(nextList);

                                                            // Update form
                                                            onChange(nextList);
                                                        }}
                                                        className={cc([
                                                            'flex-grow',
                                                            'input-defaults',
                                                            {
                                                                'ring-2 ring-coral-300 bg-coral-10 text-coral-300': error,
                                                            },
                                                        ])}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Delete item */}
                                    {list.length > 1 && (
                                        <Button
                                            variant="tertiary"
                                            theme="teal"
                                            icon={FiX}
                                            className="self-end"
                                            iconPosition="center"
                                            action={event => {
                                                // Get next list                                                     // Get next list
                                                const nextList = getListWithoutItem(
                                                    item.id
                                                );

                                                // Update current list
                                                setList(nextList);

                                                // Update form
                                                onChange(nextList);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {listMaxLength > 1 && (
                    <Button
                        variant="secondary"
                        className="self-start mt-16"
                        disabled={list.length >= listMaxLength}
                        action={addToList}>
                        {labelTodo('Add another')}
                    </Button>
                )}
            </div>
        </label>
    );
};

SelectListComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.arrayOf(
        t.shape({
            selectValue: t.oneOfType([t.string, t.number]),
            textValue: t.oneOfType([t.string, t.number]),
        })
    ),
    options: t.arrayOf(
        t.shape({
            label: t.string,
            value: t.oneOfType([t.string, t.number, t.bool]),
        })
    ),
    showText: t.bool,
    selectLabel: t.string,
    textLabel: t.string,
    listMaxLength: t.number,
    placeholder: t.string,
};

SelectListComponent.defaultProps = {
    options: [],
    defaultValue: [{ selectValue: '', textValue: '', id: nanoid() }],
    showText: false,
    selectLabel: 'Select',
    textLabel: 'Text',
    listMaxLength: 5,
};

export default SelectListComponent;
