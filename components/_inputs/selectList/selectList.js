// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';
import { nanoid } from 'nanoid';

// Utilities

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
    selectPlaceholder,
    textPlaceholder,
    selectLabel,
    showText,
    subLabel,
    textLabel,
    required,
    disabled,
    buttonLabel,
}) => {
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
        defaultValue: defaultValue.filter(item => item.selectValue.length > 0),
        rules: { required },
    });

    // Update state when using setValue
    useEffect(() => {
        if (value && value.length > 0) {
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
                {(selectLabel || textLabel) && (
                    <div className="flex mb-4 input-utility-text">
                        <span className="flex-grow mr-6">
                            {selectLabel || ''}
                        </span>
                        <span className="flex-grow ml-6">
                            {textLabel || ''}
                        </span>
                    </div>
                )}
                <div className="flex flex-col space-y-12">
                    {list.map(item => {
                        return (
                            <div key={item.id} className="flex w-full">
                                {/* Select / Input */}
                                <div className="flex flex-grow">
                                    {/* Select */}
                                    <div
                                        style={{
                                            width: showText
                                                ? 'calc(50% - 6px)'
                                                : '100%',
                                        }}
                                        className={cc([
                                            'relative flex items-center',
                                            {
                                                'mr-6': showText,
                                            },
                                        ])}>
                                        <select
                                            className={cc([
                                                'input-defaults w-full',
                                                'appearance-none !pr-40',
                                                {
                                                    'input-defaults-error': error,
                                                },
                                            ])}
                                            disabled={disabled}
                                            defaultValue={item.selectValue}
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
                                                            item.selectValue
                                                                .length > 0
                                                    )
                                                );
                                            }}>
                                            <option
                                                default
                                                value=""
                                                className="hidden">
                                                {selectPlaceholder}
                                            </option>
                                            {options.map((option, index) => (
                                                <option
                                                    key={`${option.value}-${index}`}
                                                    value={option.value}
                                                    className="font-normal text-black">
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="absolute right-0 mr-10 pointer-events-none stroke-current" />
                                    </div>

                                    {/* Input */}
                                    {showText && (
                                        <input
                                            type="text"
                                            maxLength={
                                                maxLength ? maxLength : 'none'
                                            }
                                            disabled={disabled}
                                            defaultValue={item.textValue}
                                            placeholder={textPlaceholder}
                                            onChange={event => {
                                                // Get next list
                                                const nextList = getListWithNewTextValue(
                                                    item.id,
                                                    event.target.value
                                                );

                                                // Update current list
                                                setList(nextList);

                                                // Update form
                                                onChange(nextList);
                                            }}
                                            style={{
                                                width: showText
                                                    ? 'calc(50% - 6px)'
                                                    : '100%',
                                            }}
                                            className={cc([
                                                'ml-6',
                                                'input-defaults',
                                                {
                                                    'input-defaults-error': error,
                                                },
                                            ])}
                                        />
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
                        );
                    })}
                </div>
                {listMaxLength > 1 && options.length > 1 && (
                    <Button
                        variant="quaternary"
                        className="self-start mt-16"
                        disabled={list.length >= listMaxLength}
                        action={addToList}>
                        {buttonLabel}
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
    selectPlaceholder: t.string,
    textPlaceholder: t.string,
    buttonLabel: t.string,
    required: t.bool,
};

SelectListComponent.defaultProps = {
    options: [],
    defaultValue: [{ selectValue: '', textValue: '', id: nanoid() }],
    showText: false,
    selectLabel: null,
    textLabel: null,
    listMaxLength: 5,
    required: false,
    buttonLabel: 'Add',
};

export default SelectListComponent;
