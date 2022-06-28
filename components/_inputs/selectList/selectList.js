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
import EmptyState from './../emptyState';

// Icons
import { FiX, FiChevronDown, FiPlus } from 'react-icons/fi';

const SelectListComponent = ({
    controller,
    defaultValue,
    disabled,
    nested,
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
    theme,
    missingOptionsLabel,
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

    const [loadedOptions, setLoadedOptions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(false);
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

    function getPlaceholder() {
        if (loadingOptions) {
            return metadataLabel('FormCaptureSelectLoadingOptions');
        } else {
            if (loadedOptions.length > 0) {
                return (
                    selectPlaceholder || metadataLabel('FormCaptureSelectEmpty')
                );
            } else {
                return metadataLabel('FormCaptureSelectNoOptions');
            }
        }
    }

    // ///////////////////
    // DATA
    // ///////////////////

    const columnWidth = {
        'col-span-full': !showText && value?.length === 0,
        'col-span-11': !showText && value?.length > 0,
        'col-span-6': showText,
    };

    const missingOptions = missingOptionsLabel && loadedOptions.length === 0;

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        // Assume normal options
        if (Array.isArray(options)) {
            setLoadedOptions(options);
        }
        // Or perhaps async options
        else {
            async function getOptions() {
                setLoadingOptions(true);
                setLoadedOptions(await options());
                setLoadingOptions(false);
            }
            getOptions();
        }
    }, [options]);

    // Set value from beginning
    useEffect(() => {
        if (defaultValue.length > 0) {
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
        // Potentially bugged here, as defaultValue probably should be
        // a part of the deps array, if we want to update on defaultValue as well
        // Perhaps we should do an async defaultValue like options to support async states
        // of default values.
    }, [loadedOptions]);

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
    // THEMING
    // ///////////////////

    const isBlue = theme === 'blue';
    const isTeal = theme === 'teal';

    const isNested = nested;

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <label className="flex flex-col" htmlFor={name}>
            {label && (
                <span
                    className={cc([
                        {
                            't-h6': isNested,
                            't-h5': !isNested,
                            'text-blue-100': isBlue,
                            'text-teal-100': isTeal,
                        },
                    ])}>
                    {label}
                </span>
            )}
            {subLabel && (
                <span
                    className={cc([
                        'mt-8',
                        {
                            't-sh6': isNested,
                            't-small': !isNested,
                            'text-blue-60': isBlue,
                            'text-teal-60': isTeal,
                        },
                    ])}>
                    {subLabel}
                </span>
            )}
            <div className={cc(['flex flex-col', { 'mt-16': label }])}>
                {missingOptions && <EmptyState label={missingOptionsLabel} />}

                {!missingOptions && (
                    <>
                        {(selectLabel || textLabel) && (
                            <div className="grid grid-cols-12 gap-12 mb-4 input-utility-text">
                                <span className={cc([columnWidth])}>
                                    {selectLabel || ''}
                                </span>
                                <span className={cc([columnWidth])}>
                                    {textLabel || ''}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col space-y-12">
                            {list.map(item => {
                                return (
                                    <div key={item.id}>
                                        {/* Select / Input */}
                                        <div className="grid grid-cols-12 gap-12">
                                            {/* Select */}
                                            <div
                                                className={cc([
                                                    'relative flex items-center',
                                                    columnWidth,
                                                ])}>
                                                <select
                                                    className={cc([
                                                        'input-defaults w-full',
                                                        'appearance-none !pr-40',
                                                        {
                                                            'input-defaults-error': error,
                                                        },
                                                    ])}
                                                    disabled={
                                                        disabled ||
                                                        loadedOptions.length ===
                                                            0
                                                    }
                                                    defaultValue={
                                                        item.selectValue
                                                    }
                                                    onChange={event => {
                                                        onSelectChange(
                                                            event,
                                                            item
                                                        );
                                                    }}>
                                                    <option
                                                        default
                                                        value=""
                                                        className="hidden">
                                                        {getPlaceholder()}
                                                    </option>
                                                    {loadedOptions
                                                        .sort((a, b) =>
                                                            a.label.localeCompare(
                                                                b.label
                                                            )
                                                        )
                                                        .map(
                                                            (option, index) => (
                                                                <option
                                                                    key={`${option.value}-${index}`}
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    disabled={list
                                                                        .map(
                                                                            l =>
                                                                                l.selectValue
                                                                        )
                                                                        .includes(
                                                                            option.value
                                                                        )}
                                                                    className="font-normal text-black">
                                                                    {
                                                                        option.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </select>
                                                <FiChevronDown className="absolute right-0 mr-10 pointer-events-none stroke-current" />
                                            </div>

                                            {/* Input */}
                                            {showText && (
                                                <input
                                                    type="text"
                                                    maxLength={
                                                        maxLength
                                                            ? maxLength
                                                            : 'none'
                                                    }
                                                    disabled={disabled}
                                                    defaultValue={
                                                        item.textValue
                                                    }
                                                    placeholder={
                                                        textPlaceholder ||
                                                        metadataLabel(
                                                            'FormCaptureTextEntryEmpty'
                                                        )
                                                    }
                                                    onChange={event => {
                                                        onTextChange(
                                                            event,
                                                            item
                                                        );
                                                    }}
                                                    className={cc([
                                                        {
                                                            'col-span-6':
                                                                showText &&
                                                                value?.length ===
                                                                    0,
                                                            'col-span-5':
                                                                showText &&
                                                                value?.length >
                                                                    0,
                                                        },
                                                        'input-defaults',
                                                        {
                                                            'input-defaults-error': error,
                                                        },
                                                    ])}
                                                />
                                            )}

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
                                    </div>
                                );
                            })}
                        </div>

                        <AddButton
                            {...{
                                list,
                                listMaxLength,
                                options: loadedOptions,
                                setList,
                                value,
                            }}
                        />
                    </>
                )}
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
            <div className="flex justify-end col-span-1">
                <Button
                    variant="tertiary"
                    theme="teal"
                    icon={FiX}
                    className="self-end !px-8"
                    iconPosition="center"
                    action={deleteAction}
                />
            </div>
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
            list.length < listMaxLength,
        ].every(x => x) && (
            <Button
                variant="secondary"
                theme="teal"
                className="self-start mt-12"
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
    nested: t.bool,
    options: t.oneOfType([
        t.func,
        t.arrayOf(
            t.shape({
                label: t.string,
                value: t.oneOfType([t.string, t.number, t.bool]),
            })
        ),
    ]),
    showText: t.bool,
    selectLabel: t.string,
    textLabel: t.string,
    listMaxLength: t.number,
    selectPlaceholder: t.string,
    textPlaceholder: t.string,
    required: t.bool,
    theme: t.oneOf(['teal', 'blue']),
};

SelectListComponent.defaultProps = {
    options: [],
    defaultValue: [],
    nested: false,
    showText: false,
    selectLabel: null,
    textLabel: null,
    listMaxLength: 5,
    required: false,
    setValue() {},
    theme: 'teal',
};

export default SelectListComponent;
