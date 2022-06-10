// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Controller } from 'react-hook-form';

// Utilities
import { useLabels } from 'utilities/hooks';

// Icons
import { FiChevronDown } from 'react-icons/fi';

const SelectComponent = ({
    name,
    label,
    subLabel,
    defaultValue,
    error,
    placeholder,
    options,
    controller,
    required,
    disabled,
    setValue,
    ...rest
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label: metadataLabel } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [loadingOptions, setLoadingOptions] = useState(false);
    const [loadedOptions, setLoadedOptions] = useState([]);

    // ///////////////////
    // METHODS
    // ///////////////////

    function getPlaceholder() {
        if (loadingOptions) {
            return metadataLabel('FormCaptureSelectLoadingOptions');
        } else {
            if (loadedOptions.length > 0) {
                return placeholder || metadataLabel('FormCaptureSelectEmpty');
            } else {
                return metadataLabel('FormCaptureSelectNoOptions');
            }
        }
    }

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
    }, []);

    // Defaultvalue
    useEffect(() => {
        if (defaultValue && loadedOptions) {
            setValue(name, defaultValue);
        }
    }, [defaultValue, loadedOptions]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <label className="flex flex-col flex-grow">
            {label && <span className="input-label">{label}</span>}
            {subLabel && (
                <span className="mt-8 input-sublabel">{subLabel}</span>
            )}
            <Controller
                control={controller}
                defaultValue={defaultValue}
                name={name}
                rules={{ required }}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                }) => (
                    <div
                        className={cc([
                            'relative flex items-center',
                            {
                                'mt-16': label,
                            },
                        ])}>
                        <select
                            ref={ref}
                            className={cc([
                                'input-defaults',
                                'appearance-none flex-grow pr-20 max-w-full',
                                {
                                    'input-defaults-error': error,
                                },
                            ])}
                            onChange={event => onChange(event)}
                            disabled={disabled || loadedOptions.length === 0}
                            {...rest}>
                            <option default value="" className="hidden">
                                {getPlaceholder()}
                            </option>
                            {loadedOptions
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((option, index) => (
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
                )}
            />
        </label>
    );
};

SelectComponent.propTypes = {
    name: t.string,
    label: t.string,
    defaultValue: t.string,
    error: t.object,
    options: t.arrayOf(
        t.shape({
            label: t.string,
            value: t.oneOfType([t.string, t.number, t.bool]),
        })
    ),
    required: t.bool,
};

SelectComponent.defaultProps = {
    options: [],
    asyncOptions: () => null,
    required: false,
    setValue() {},
};

export default SelectComponent;
