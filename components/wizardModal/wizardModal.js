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
import DeleteModal from 'components/deleteModal';

const WizardModalComponent = ({
    children,
    isSaving,
    deleteProps,
    isOpen,
    onCancel,
    onDelete,
    onSave,
    saveText,
    title,
}) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [modalIsDeleting, setModalIsDeleting] = useState(false);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <ModalBase {...{ isOpen }}>
            {/* Modal content */}
            <div className="flex flex-col overflow-y-auto scrolling-touch max-h-[90vh] sm:max-h-[80vh] pb-32 p-2 overflow-x-hidden">
                {title && <h3 className="mb-32 text-teal-100 t-h3">{title}</h3>}
                {children}
            </div>

            {/* Modal actions */}
            <div className="flex justify-end mt-32 space-x-16">
                {deleteProps && deleteProps.show && (
                    <Button
                        className="mr-auto"
                        variant="secondary"
                        theme="coral"
                        action={() => setDeleteModalIsOpen(true)}>
                        {label('ButtonDelete')}
                    </Button>
                )}
                <Button variant="tertiary" theme="coral" action={onCancel}>
                    {label('ButtonCancel')}
                </Button>
                <Button theme="coral" action={onSave} disabled={isSaving}>
                    {saveText || label('ButtonSave')}
                </Button>
            </div>
            {deleteProps && (
                <DeleteModal
                    {...{
                        isOpen: deleteModalIsOpen,
                        isDeleting: modalIsDeleting,
                        onCancel() {
                            setDeleteModalIsOpen(false);
                        },
                        ...deleteProps,
                        async onDelete() {
                            setModalIsDeleting(true);
                            deleteProps.onDelete();
                            setDeleteModalIsOpen(false);
                            setModalIsDeleting(false);
                        },
                    }}
                />
            )}
        </ModalBase>
    );
};

WizardModalComponent.propTypes = {
    isOpen: t.bool,
    onCancel: t.func,
    onSave: t.func,
    saveText: t.string,
    title: t.string,
    deleteProps: t.shape({
        title: t.string,
        text: t.string,
        onDelete: t.func,
    }),
};

WizardModalComponent.defaultProps = {
    isOpen: false,
    saveText: '',
    deleteProps: null,
};

export default WizardModalComponent;
