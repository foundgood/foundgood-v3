// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';
import { nanoid } from 'nanoid';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';

// Icons
import { FiX, FiChevronDown, FiPlus } from 'react-icons/fi';

const SelectListComponent = ({
    controller,
    defaultValue,
    disabled,
    label,
    listMaxLength,
    maxLength,
    name,
    options,
    required,
    selectLabel,
    selectPlaceholder,
    setValue,
    showText,
    subLabel,
    textLabel,
    textPlaceholder,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label: metadataLabel } = useLabels();
    const {
        field: { onChange, value },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
        defaultValue: defaultValue.filter(item => item.selectValue.length > 0),
        rules: { required },
    });

    // ///////////////////
    // STATE
    // ///////////////////

    const [list, setList] = useState([
        { selectValue: '', textValue: '', id: nanoid() },
    ]);

    // ///////////////////
    // METHODS
    // ///////////////////

    function onSelectChange(event, item) {
        // Get next list
        const nextList = [
            ...list.map(listItem =>
                listItem.id === item.id
                    ? { ...listItem, selectValue: event.target.value }
                    : listItem
            ),
        ];

        // Update current list
        setList(nextList);

        // Update form
        onChange(nextList.filter(item => item.selectValue.length > 0));
    }

    function onTextChange(event, item) {
        // Get next list
        const nextList = [
            ...list.map(listItem =>
                listItem.id === item.id
                    ? { ...listItem, textValue: event.target.value }
                    : listItem
            ),
        ];

        // Update current list
        setList(nextList);

        // Update form
        onChange(nextList);
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    // Set value from beginning
    useEffect(() => {
        if (defaultValue.selectValue) {
            setList(
                defaultValue.map(item => ({
                    selectValue: item.selectValue,
                    textValue: item.textValue ?? '',
                    id: nanoid(),
                }))
            );
            setValue(
                name,
                defaultValue.map(item => ({
                    selectValue: item.selectValue,
                    textValue: item.textValue ?? '',
                    id: nanoid(),
                }))
            );
        }
    }, [defaultValue]);

    // Update local state when using setValue
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

    // ///////////////////
    // RENDER
    // ///////////////////

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
                                                onSelectChange(event, item);
                                            }}>
                                            <option
                                                default
                                                value=""
                                                className="hidden">
                                                {selectPlaceholder ||
                                                    metadataLabel(
                                                        'FormCaptureSelectEmpty'
                                                    )}
                                            </option>
                                            {options
                                                .sort((a, b) =>
                                                    a.label.localeCompare(
                                                        b.label
                                                    )
                                                )
                                                .map((option, index) => (
                                                    <option
                                                        key={`${option.value}-${index}`}
                                                        value={option.value}
                                                        disabled={list
                                                            .map(
                                                                l =>
                                                                    l.selectValue
                                                            )
                                                            .includes(
                                                                option.value
                                                            )}
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
                                            placeholder={
                                                textPlaceholder ||
                                                metadataLabel(
                                                    'FormCaptureTextEntryEmpty'
                                                )
                                            }
                                            onChange={event => {
                                                onTextChange(event, item);
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

                                <DeleteButton
                                    {...{
                                        item,
                                        list,
                                        onChange,
                                        setList,
                                        value,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                <AddButton
                    {...{
                        list,
                        listMaxLength,
                        options,
                        setList,
                        value,
                    }}
                />
            </div>
        </label>
    );
};

const DeleteButton = ({ item, list, onChange, setList, value }) => {
    // ///////////////////
    // METHODS
    // ///////////////////

    function deleteAction() {
        // Reset list if only one thing is selected
        if (value.length === 1 && list.length === 1) {
            // Update current list
            setList([
                {
                    selectValue: '',
                    textValue: '',
                    id: nanoid(),
                },
            ]);

            // Update form
            onChange([]);
        }

        // Remove empty list item
        else if (value.length > 0 && list.length === value.length + 1) {
            // Update current list
            setList(list.filter(l => l.selectValue));
        }

        // Delete item by id
        else if (value.length > 0 && list.length === value.length) {
            // Get next list by filtering out current id
            const nextList = [...list.filter(l => l.id !== item.id)];

            // Update current list
            setList(nextList);

            // Update form
            onChange(nextList);
        }
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        value?.length > 0 && (
            <Button
                variant="tertiary"
                theme="teal"
                icon={FiX}
                className="self-end"
                iconPosition="center"
                action={deleteAction}
            />
        )
    );
};

const AddButton = ({ list, listMaxLength, options, setList, value }) => {
    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        [
            listMaxLength > 1,
            options.length > 1,
            list.length < options.length,
            list.length === value?.length,
        ].every(x => x) && (
            <Button
                variant="tertiary"
                theme="teal"
                className="self-start mt-16"
                icon={FiPlus}
                iconPosition="center"
                action={() =>
                    setList([
                        ...list,
                        { selectValue: '', textValue: '', id: nanoid() },
                    ])
                }
            />
        )
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
    setValue() {},
};

export default SelectListComponent;
