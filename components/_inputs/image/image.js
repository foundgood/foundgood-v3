// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { s3 } from 'utilities/api';

// Components
import Button from 'components/button';

const ImageComponent = ({
    name,
    label: inputLabel,
    subLabel,
    defaultValue,
    controller,
    ...rest
}) => {
    // Hook: Metadata
    const { label } = useMetadata();

    // Controller from useForm
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({
        name,
        control: controller,
    });

    async function uploadFile(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const uploadData = await s3.uploadMediaFile(file);
            onChange(uploadData.Location);
        }
    }

    return (
        <label className="flex flex-col" htmlFor={name}>
            {inputLabel && <span className="input-label">{inputLabel}</span>}
            {subLabel && (
                <span className="mt-8 input-sublabel">{subLabel}</span>
            )}

            <Button
                variant="quaternary"
                className="self-start mt-16"
                action={'fake'}>
                {label('custom.FA_ButtonUploadImage')}
            </Button>
            <input
                ref={ref}
                id={name}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={uploadFile}
                defaultValue={''}
                className={cc([
                    'input-defaults hidden',
                    {
                        'input-defaults-error': error,
                        'mt-16': label,
                    },
                ])}
                {...rest}
            />
            {(value || defaultValue) && (
                <img
                    className="mt-24 rounded-4 w-128 h-128"
                    src={value || defaultValue}
                />
            )}
        </label>
    );
};

ImageComponent.propTypes = {
    name: t.string,
    label: t.string,
    subLabel: t.string,
    defaultValue: t.string,
    required: t.bool,
};

ImageComponent.defaultProps = {};

export default ImageComponent;
