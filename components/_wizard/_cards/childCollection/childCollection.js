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
import InputModal from 'components/_modals/inputModal';
import DeleteModal from 'components/_modals/deleteModal';

// Icons
import {
    FiChevronUp,
    FiChevronDown,
    FiPlus,
    FiTrash2,
    FiEdit2,
} from 'react-icons/fi';

const ChildCollectionComponent = ({ title, item, collection, methods }) => {
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

    const addForm = useForm();
    const editForm = useForm();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function addChildItem(formData) {
        // Modal save button state
        addModalSaving();
        try {
            // Run add method
            await methods?.add.action(formData, item);

            // Close modal
            addModalClose();

            // Modal save button state
            addModalNotSaving();

            // Clear content in form
            addForm.reset();

            // Expand content
            setExpandedContent(true);
        } catch (error) {
            // Modal save button state
            addModalNotSaving();
            console.warn(error);
        }
    }

    async function editChildItem(formData) {
        // Modal save button state
        editModalSaving();
        try {
            // Run edit method
            await methods?.edit.action(formData, updateId, item);

            // Close modal
            editModalClose();

            // Modal save button state
            editModalNotSaving();

            // Clear content in form
            editForm.reset();

            // Reset update id
            setUpdateId(null);
        } catch (error) {
            // Modal save button state
            editModalNotSaving();
            console.warn(error);
        }
    }

    async function deleteChildItem() {
        // Modal save button state
        deleteModalSaving();
        try {
            // Do the delete
            await methods?.delete.action(deleteId, item);

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
        if (collection?.items(item).length === 0) {
            setExpandedContent(false);
        }
    }, [collection?.items(item)]);

    useEffect(() => {
        if (updateId && !editModalState.isSaving) {
            methods?.edit.setFieldValues(editForm, updateId);
        }
    }, [updateId]);

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
                        {title} ({collection?.items(item).length})
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
                                action={() => {
                                    // Reset update id
                                    setUpdateId(null);
                                    // Clear content in form
                                    addForm.reset();
                                    // Open
                                    addModalOpen();
                                }}
                            />
                        )}
                        {/* Expand */}
                        {collection?.items(item).length > 0 && (
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
                        {collection?.items(item).map(childItem => (
                            // Item wrapper
                            <div
                                key={childItem.Id}
                                className="grid items-center grid-cols-7 gap-16 p-16 bg-white rounded-8">
                                <div className="flex flex-col justify-center flex-shrink col-span-5">
                                    {/* Pre title */}
                                    {collection?.preTitle &&
                                        collection?.preTitle(childItem) && (
                                            <span className="t-sh6 text-teal-60">
                                                {collection?.preTitle(
                                                    childItem
                                                )}
                                            </span>
                                        )}
                                    {/* Title */}
                                    <h5 className="truncate t-h5">
                                        {collection?.title(childItem)}
                                    </h5>
                                    {/* Post title */}
                                    {collection?.postTitle &&
                                        collection?.postTitle(childItem) && (
                                            <span className="t-footnote text-teal-60">
                                                {collection?.postTitle(
                                                    childItem
                                                )}
                                            </span>
                                        )}
                                </div>

                                {/* Item controls */}
                                <div className="flex justify-end h-40 col-span-2 space-x-4">
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
                                                setDeleteId(childItem.Id);
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
                                                setUpdateId(null);
                                                addForm.reset();
                                                editModalOpen();
                                                setTimeout(() => {
                                                    setUpdateId(childItem.Id);
                                                }, 0);
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
                <InputModal
                    {...{
                        form: addForm,
                        fields: collection?.fields(item, 'add'),
                        onCancel() {
                            addModalClose();
                        },
                        async onSave() {
                            await addForm.handleSubmit(
                                async data => await addChildItem(data)
                            )();
                        },
                        title: methods?.add.title,
                        ...addModalState,
                    }}
                />
            )}

            {/* Edit wizard */}
            {methods?.edit && (
                <InputModal
                    {...{
                        form: editForm,
                        fields: collection?.fields(item, 'edit'),
                        onCancel() {
                            editModalClose();
                        },
                        async onSave() {
                            await editForm.handleSubmit(
                                async data => await editChildItem(data)
                            )();
                        },
                        title: methods?.edit.title,
                        ...editModalState,
                    }}
                />
            )}

            {/* Delete wizard */}
            {methods?.delete && (
                <DeleteModal
                    {...{
                        onCancel() {
                            deleteModalClose();
                        },
                        async onDelete() {
                            await deleteChildItem();
                        },
                        title: methods?.delete.title,
                        text: methods?.delete.text,
                        ...deleteModalState,
                    }}
                />
            )}
        </>
    );
};

ChildCollectionComponent.propTypes = {
    title: t.string.isRequired,
    item: t.object.isRequired,
    collection: t.shape({
        title: t.func.isRequired,
        preTitle: t.func,
        postTitle: t.func,
        items: t.func.isRequired,
        fields: t.func.isRequired,
    }),
    methods: t.shape({
        add: t.shape({
            title: t.string.isRequired,
            action: t.func.isRequired,
        }),
        edit: t.shape({
            title: t.string.isRequired,
            action: t.func.isRequired,
            setFieldValues: t.func.isRequired,
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
        preTitle: null,
        postTitle: null,
        items: [],
        fields: [],
    },
};

export default ChildCollectionComponent;
