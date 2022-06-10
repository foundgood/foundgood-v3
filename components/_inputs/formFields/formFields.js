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
    Reflection,
} from 'components/_inputs';

const FormFields = ({ fields, form }) => {
    const renderFormFields = fields => {
        const { control, setValue } = form;
        return fields.map((field, index) => {
            // Extract all possible values
            const { type, name } = field;

            const sharedProps = {
                ...field,
                setValue,
                controller: control,
            };

            switch (type) {
                case 'Text':
                    return <Text key={name + index} {...sharedProps} />;
                case 'LongText':
                    return <LongText key={name + index} {...sharedProps} />;
                case 'Select':
                    return <Select key={name + index} {...sharedProps} />;
                case 'SelectList':
                    return <SelectList key={name + index} {...sharedProps} />;
                case 'TextList':
                    return <TextList key={name + index} {...sharedProps} />;
                case 'DateRange':
                    return <DateRange key={name + index} {...sharedProps} />;
                case 'DatePicker':
                    return <DatePicker key={name + index} {...sharedProps} />;
                case 'Image':
                    return <Image key={name + index} {...sharedProps} />;
                case 'Reflection':
                    return <Reflection key={name + index} {...sharedProps} />;
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
