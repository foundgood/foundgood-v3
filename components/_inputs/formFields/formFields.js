// React
import React from 'react';

// Packages
import t from 'prop-types';

// Utilities

// Components
import {
    Text,
    Select,
    SelectList,
    LongText,
    TextList,
    DatePicker,
    DateRange,
    Image,
} from 'components/_inputs';

const FormFields = ({ fields, form }) => {
    const renderFormFields = fields => {
        const { control, setValue } = form;
        return fields.map((field, index) => {
            // Extract all possible values
            const {
                type,
                name,
                label,
                placeholder,
                defaultValue,
                maxLength,
                disabled,
                required,
                options,
                subLabel,
                buttonLabel,
                listMaxLength,
                textPlaceholder,
                selectPlaceholder,
                showText,
            } = field;

            switch (type) {
                case 'Text':
                    return (
                        <Text
                            key={name + index}
                            {...{
                                name,
                                label,
                                placeholder,
                                defaultValue,
                                disabled,
                                required,
                                maxLength,
                                controller: control,
                                setValue,
                            }}
                        />
                    );
                case 'LongText':
                    return (
                        <LongText
                            key={name + index}
                            {...{
                                name,
                                label,
                                placeholder,
                                defaultValue,
                                disabled,
                                required,
                                maxLength,
                                subLabel,
                                setValue,
                                controller: control,
                            }}
                        />
                    );
                case 'Select':
                    return (
                        <Select
                            key={name + index}
                            {...{
                                name,
                                label,
                                placeholder,
                                defaultValue,
                                disabled,
                                required,
                                options,
                                subLabel,
                                controller: control,
                                setValue,
                            }}
                        />
                    );
                case 'SelectList':
                    return (
                        <SelectList
                            key={name + index}
                            {...{
                                name,
                                label,
                                showText,
                                placeholder,
                                defaultValue,
                                disabled,
                                required,
                                buttonLabel,
                                listMaxLength,
                                options,
                                textPlaceholder,
                                selectPlaceholder,
                                subLabel,
                                controller: control,
                                setValue,
                            }}
                        />
                    );
                case 'TextList':
                    return (
                        <TextList
                            key={name + index}
                            {...{
                                name,
                                label,
                                placeholder,
                                defaultValue,
                                required,
                                buttonLabel,
                                listMaxLength,
                                maxLength,
                                subLabel,
                                controller: control,
                                setValue,
                            }}
                        />
                    );
                case 'DateRange':
                    return (
                        <DateRange
                            key={name + index}
                            {...{
                                name,
                                label,
                                subLabel,
                                defaultValue,
                                disabled,
                                required,
                                controller: control,
                            }}
                        />
                    );
                case 'DatePicker':
                    return (
                        <DatePicker
                            key={name + index}
                            {...{
                                name,
                                label,
                                defaultValue,
                                disabled,
                                subLabel,
                                required,
                                controller: control,
                            }}
                        />
                    );
                case 'Image':
                    return (
                        <Image
                            key={name + index}
                            {...{
                                name,
                                defaultValue,
                                label,
                                subLabel,
                                controller: control,
                            }}
                        />
                    );
                default:
                    break;
            }
        });
    };
    return <>{renderFormFields(fields)}</>;
};

FormFields.propTypes = {
    fields: t.array,
    form: t.object,
};

FormFields.defaultProps = {
    fields: [],
};

export default FormFields;
