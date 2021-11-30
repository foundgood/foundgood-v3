// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { useController } from 'react-hook-form';

// Utilities
import { s3 } from 'utilities/api';

// Components
import Button from 'components/button';

const AttachComponent = ({
    name,
    label,
    defaultValue,
    accept,
    controller,
    type,
    onClick,
    setAttachLoading,
    ...rest
}) => {
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
            setAttachLoading(true);
            const file = event.target.files[0];
            const uploadData = await s3.uploadMediaFile(file);
            onChange(uploadData.Location);
            setAttachLoading(false);
        }
    }

    return (
        <label className="flex flex-col" htmlFor={name}>
            <Button
                variant="secondary"
                className="self-start mt-16"
                action={'fake'}>
                {label}
            </Button>
            <input
                ref={ref}
                id={name}
                type="file"
                accept={accept}
                onChange={event => {
                    uploadFile(event);
                    onClick();
                }}
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
        </label>
    );
};

AttachComponent.propTypes = {
    accept: t.string,
    type: t.oneOf(['video', 'image', 'document']).isRequired,
};

AttachComponent.defaultProps = {
    accept: '.png,.jpg,.jpeg',
    type: 'image',
};

export default AttachComponent;
