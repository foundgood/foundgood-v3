// React
import React, { useEffect, useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import { Transition } from '@headlessui/react';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';
import ModalBase from 'components/modalBase';

const DeleteModalComponent = ({
    children,
    isDeleting,
    isOpen,
    onCancel,
    onDelete,
    title,
    text,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <ModalBase {...{ isOpen }}>
            {/* Modal content */}
            <div className="flex flex-col overflow-y-auto scrolling-touch max-h-[90vh] sm:max-h-[80vh] pb-32 p-2 overflow-x-hidden">
                {title && <h3 className="mb-24 text-teal-100 t-h3">{title}</h3>}
                {text && (
                    <h3 className="mb-32 text-teal-100 t-preamble">{text}</h3>
                )}
            </div>

            {/* Modal actions */}
            <div className="flex justify-end mt-32 space-x-16">
                <Button variant="tertiary" theme="coral" action={onCancel}>
                    {label('ButtonCancel')}
                </Button>
                <Button theme="coral" action={onDelete} disabled={isDeleting}>
                    {label('ButtonYesDelete')}
                </Button>
            </div>
        </ModalBase>
    );
};

DeleteModalComponent.propTypes = {
    isDeleting: t.bool,
    isOpen: t.bool,
    onCancel: t.func.isRequired,
    onDelete: t.func.isRequired,
    text: t.string,
    title: t.string,
};

DeleteModalComponent.defaultProps = {
    isOpen: false,
    isDeleting: false,
};

export default DeleteModalComponent;
