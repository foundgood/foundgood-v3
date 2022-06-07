// React
import React from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';

// Components
import Button from 'components/button';
import BaseModal from 'components/_modals/baseModal';

const DeleteModalComponent = ({
    isOpen,
    isSaving,
    onCancel,
    onDelete,
    text,
    title,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <BaseModal {...{ isOpen }}>
            {/* Modal content */}
            <div className="flex flex-col overflow-y-auto scrolling-touch max-h-[90vh] sm:max-h-[80vh] pb-32 p-2 overflow-x-hidden">
                {title && <h3 className="mb-24 text-teal-100 t-h3">{title}</h3>}
                {text && (
                    <h3 className="mb-32 text-teal-100 t-preamble">{text}</h3>
                )}
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end mt-32 space-x-16">
                <p
                    className={cc([
                        'hidden t-footnote text-coral-60 md:flex transition-default mr-auto',
                        {
                            'opacity-0': !isSaving,
                            'opacity-100': isSaving,
                        },
                    ])}>
                    {label('MessageSaved')}
                </p>
                <Button variant="tertiary" theme="coral" action={onCancel}>
                    {label('ButtonCancel')}
                </Button>
                <Button theme="coral" action={onDelete} disabled={isSaving}>
                    {label('ButtonYesDelete')}
                </Button>
            </div>
        </BaseModal>
    );
};

DeleteModalComponent.propTypes = {
    isOpen: t.bool,
    isSaving: t.bool,
    onCancel: t.func.isRequired,
    onDelete: t.func.isRequired,
    text: t.string,
    title: t.string,
};

DeleteModalComponent.defaultProps = {
    isOpen: false,
    isSaving: false,
};

export default DeleteModalComponent;
