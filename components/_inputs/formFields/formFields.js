// React
import React, { useEffect } from 'react';

// Packages
import t from 'prop-types';

// Utilities

// Components
import {
    Text,
    Select,
    SelectList,
    LongText,
    DatePicker,
    DateRange,
    Metrics,
    Number,
    Range,
    Image,
    Reflection,
    Section,
    Nested,
} from 'components/_inputs';

const FormFields = ({ fields, form }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { watch } = form;

    // ///////////////////
    // DATA
    // ///////////////////

    // Object to contain form field watchers
    const watchFields = fields.reduce(
        (acc, field) => ({
            ...acc,
            ...(field.onWatch ? { [field.name]: field.onWatch } : {}),
        }),
        {}
    );

    // ///////////////////
    // METHODS
    // ///////////////////

    const renderFormFields = fields => {
        const { control, setValue } = form;
        return fields.map((field, index) => {
            // Extract all possible values
            const { type, name, ...rest } = field;

            const sharedProps = {
                name,
                ...rest,
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
                case 'DateRange':
                    return <DateRange key={name + index} {...sharedProps} />;
                case 'DatePicker':
                    return <DatePicker key={name + index} {...sharedProps} />;
                case 'Metrics':
                    return <Metrics key={name + index} {...sharedProps} />;
                case 'Number':
                    return <Number key={name + index} {...sharedProps} />;
                case 'Image':
                    return <Image key={name + index} {...sharedProps} />;
                case 'Range':
                    return <Range key={name + index} {...sharedProps} />;
                case 'Reflection':
                    return <Reflection key={name + index} {...sharedProps} />;
                case 'Section':
                    return (
                        <Section key={name + index} {...{ ...sharedProps }} />
                    );
                case 'Nested':
                    return <Nested>{renderFormFields(field.fields)}</Nested>;
                default:
                    break;
            }
        });
    };

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        // Run onWatch from form field if it exists - all values being watched
        const subscription = watch((value, { name }) => {
            if (watchFields[name]) {
                watchFields[name](value[name], form);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // ///////////////////
    // RENDER
    // ///////////////////

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
