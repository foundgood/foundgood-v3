// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import AnimateHeight from 'react-animate-height';
import { useForm } from 'react-hook-form';

// Utilities
import { useLabels, useModalState } from 'utilities/hooks';

// Components
import Button from 'components/button';
import { InputWrapper, FormFields } from 'components/_inputs';
import WizardModal from 'components/_modals/wizardModal';
import DeleteModal from 'components/_modals/deleteModal';

// Icons
import {
    FiChevronUp,
    FiChevronDown,
    FiPlus,
    FiTrash2,
    FiEdit2,
} from 'react-icons/fi';

const ChildCollectionComponent = ({ title, collection, methods }) => {
    // ///////////////////
    // HOOKS
    // ///////////////////

    const { label } = useLabels();
    const {
        modalState: addModalState,
        modalOpen: addModalOpen,
        modalClose: addModalClose,
        modalSaving: addModalSaving,
        modalNotSaving: addModalNotSaving,
    } = useModalState();
    const {
        modalState: editModalState,
        modalOpen: editModalOpen,
        modalClose: editModalClose,
        modalSaving: editModalSaving,
        modalNotSaving: editModalNotSaving,
    } = useModalState();
    const {
        modalState: deleteModalState,
        modalOpen: deleteModalOpen,
        modalClose: deleteModalClose,
        modalSaving: deleteModalSaving,
        modalNotSaving: deleteModalNotSaving,
    } = useModalState();

    // ///////////////////
    // STATE
    // ///////////////////

    const [expandedContent, setExpandedContent] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function addChild(formData) {
        // Modal save button state
        addModalSaving();
        try {
            // Run add method
            await methods.add.action(formData);

            // Close modal
            addModalClose();

            // Modal save button state
            addModalNotSaving();

            // Clear content in form
            mainForm.reset();

            // Expand content
            setExpandedContent(true);
        } catch (error) {
            // Modal save button state
            addModalNotSaving();
            console.warn(error);
        }
    }

    async function editChild(formData) {
        // Modal save button state
        editModalSaving();
        try {
            // Run add method
            await methods.edit.action(formData, id);

            // Close modal
            editModalClose();

            // Modal save button state
            editModalNotSaving();

            // Clear content in form
            mainForm.reset();

            // Reset update id
            setUpdateId(null);
        } catch (error) {
            // Modal save button state
            editModalNotSaving();
            console.warn(error);
        }
    }

    async function deleteChild() {
        // Modal save button state
        deleteModalSaving();
        try {
            // Do the delete
            await methods?.delete.action(deleteId);

            // Close modal
            deleteModalClose();

            // Modal save button state
            deleteModalNotSaving();

            // Reset delete id
            setDeleteId(null);
        } catch (error) {
            // Modal save button state
            deleteModalNotSaving();
            console.warn(error);
        }
    }

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (collection?.items.length === 0) {
            setExpandedContent(false);
        }
    }, [collection?.items]);

    useEffect(() => {
        if (updateId) {
            methods.edit.setValues(mainForm, updateId);
        }
    }, [updateId, editModalState]);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <div className="flex flex-col p-16 mt-16 bg-teal-10 rounded-8">
                {/* Top row wrapper */}
                <h6 className="flex items-center justify-between t-h6">
                    {/* Title */}
                    <span className="relative top-2">
                        {title} ({collection?.items.length})
                    </span>
                    {/* Collection controls */}
                    <div className="flex h-40 space-x-4">
                        {/* Add */}
                        {methods?.add && (
                            <Button
                                title={label('ButtonAdd')}
                                variant="tertiary"
                                theme="teal"
                                icon={FiPlus}
                                iconPosition="center"
                                iconType="stroke"
                                className="!px-8"
                                action={addModalOpen}
                            />
                        )}
                        {/* Expand */}
                        {collection?.items.length > 0 && (
                            <Button
                                title={label('ButtonExpandCollapse')}
                                variant="tertiary"
                                theme="teal"
                                icon={
                                    expandedContent
                                        ? FiChevronUp
                                        : FiChevronDown
                                }
                                iconPosition="center"
                                iconType="stroke"
                                className="!px-8"
                                action={() =>
                                    setExpandedContent(!expandedContent)
                                }
                            />
                        )}
                    </div>
                </h6>
                {/* Collection items */}
                <AnimateHeight
                    duration={300}
                    animateOpacity={true}
                    height={expandedContent ? 'auto' : 0}>
                    <div className="flex flex-col mt-16 space-y-12">
                        {collection?.items.map(item => (
                            // Item wrapper
                            <div
                                key={item.Id}
                                className="flex items-center justify-between p-16 bg-white rounded-8">
                                {/* Title */}
                                <h5 className="relative t-h5 top-2">
                                    {collection?.title(item)}
                                </h5>

                                {/* Item controls */}
                                <div className="flex h-40 space-x-4">
                                    {/* Delete */}
                                    {methods?.delete && (
                                        <Button
                                            title={label('ButtonDelete')}
                                            variant="tertiary"
                                            theme="teal"
                                            icon={FiTrash2}
                                            iconPosition="center"
                                            iconType="stroke"
                                            className="!px-8"
                                            action={() => {
                                                deleteModalOpen();
                                                setDeleteId(item.Id);
                                            }}
                                        />
                                    )}
                                    {/* Edit */}
                                    {methods?.edit && (
                                        <Button
                                            title={label('ButtonEdit')}
                                            variant="tertiary"
                                            theme="teal"
                                            icon={FiEdit2}
                                            iconPosition="center"
                                            iconType="stroke"
                                            className="!px-8"
                                            action={() => {
                                                editModalOpen();
                                                setUpdateId(item.Id);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimateHeight>
            </div>

            {/* Add wizard */}
            {methods?.add && (
                <WizardModal
                    {...{
                        form: mainForm,
                        onCancel() {
                            addModalClose();
                        },
                        onSave() {
                            mainForm.handleSubmit(addChild)();
                        },
                        title: methods.add.title,
                        ...addModalState,
                    }}>
                    <InputWrapper>
                        <FormFields
                            {...{
                                fields: collection?.fields,
                                form: mainForm,
                            }}
                        />
                    </InputWrapper>
                </WizardModal>
            )}

            {/* Edit wizard */}
            {methods?.edit && (
                <WizardModal
                    {...{
                        form: mainForm,
                        onCancel() {
                            editModalClose();
                        },
                        onSave() {
                            mainForm.handleSubmit(editChild)();
                        },
                        title: methods.edit.title,
                        ...editModalState,
                    }}>
                    <InputWrapper>
                        <FormFields
                            {...{
                                fields: collection?.fields,
                                form: mainForm,
                            }}
                        />
                    </InputWrapper>
                </WizardModal>
            )}

            {/* Delete wizard */}
            {methods?.delete && (
                <DeleteModal
                    {...{
                        onCancel() {
                            deleteModalClose();
                        },
                        async onDelete() {
                            await deleteChild();
                        },
                        title: methods.delete.title,
                        text: methods.delete.text,
                        ...deleteModalState,
                    }}
                />
            )}
        </>
    );
};

ChildCollectionComponent.propTypes = {
    title: t.string.isRequired,
    collection: t.shape({
        title: t.oneOfType([t.string, t.func]),
        items: t.array.isRequired,
        fields: t.array.isRequired,
    }),
    methods: t.shape({
        add: t.shape({
            title: t.string.isRequired,
            action: t.func.isRequired,
        }),
        edit: t.shape({
            title: t.string.isRequired,
            action: t.func.isRequired,
            setValues: t.func.isRequired,
        }),
        delete: t.shape({
            title: t.string.isRequired,
            text: t.string,
            action: t.func.isRequired,
        }),
    }),
};

ChildCollectionComponent.defaultProps = {
    title: '',
    methods: {
        add: null,
        edit: null,
        delete: null,
    },
    collection: {
        title: '',
        items: [],
        fields: [],
    },
};

export default ChildCollectionComponent;
