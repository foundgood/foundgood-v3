// React
import React, { useState } from 'react';

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
import { FiX } from 'react-icons/fi';

const TextListComponent = ({
    controller,
    defaultValue,
    label,
    listMaxLength,
    maxLength,
    name,
    placeholder,
    subLabel,
}) => {
    // Hook: Metadata
    const { labelTodo } = useMetadata();

    // Local state
    const [list, setList] = useState(
        defaultValue.map(item => ({ value: item, id: nanoid() }))
    );

    // Method: Handles add to list
    function addToList() {
        setList([...list, { value: '', id: nanoid() }]);
    }

    // Method: Returns list without item based on id
    function getListWithoutItem(id) {
        return [...list.filter(item => item.id !== id)];
    }

    // Method: Returns list with new value based on id
    function getListWithNewValue(id, value) {
        return [...list.map(item => (item.id === id ? { value, id } : item))];
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
            setList(value.map(item => ({ value: item, id: nanoid() })));
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
                                    <div className="flex flex-col w-full">
                                        <input
                                            type="text"
                                            maxLength={
                                                maxLength ? maxLength : 'none'
                                            }
                                            defaultValue={item.value}
                                            placeholder={placeholder}
                                            onChange={event => {
                                                // Get next list
                                                const nextList = getListWithNewValue(
                                                    item.id,
                                                    event.target.value
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
                                        {maxLength > 0 && (
                                            <div className="mt-4 text-right input-utility-text">
                                                {item.value.length} /{' '}
                                                {maxLength.toString()}
                                            </div>
                                        )}
                                    </div>

                                    {list.length > 1 && (
                                        <Button
                                            variant="tertiary"
                                            theme="teal"
                                            icon={FiX}
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

TextListComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.arrayOf(t.oneOf([t.string, t.number])),
    error: t.object,
    maxLength: t.number,
};

TextListComponent.defaultProps = {
    maxLength: null,
    defaultValue: [],
};

export default TextListComponent;
