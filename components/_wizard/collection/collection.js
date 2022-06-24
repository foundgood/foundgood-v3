// React
import React, { useEffect, useState } from 'react';

// Packages
import t from 'prop-types';
import cc from 'classcat';
import { useForm } from 'react-hook-form';

// Utilities
import { useModalState } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import EmptyState from 'components/_wizard/emptyState';
import InputModal from 'components/_modals/inputModal';
import DeleteModal from 'components/_modals/deleteModal';
import { BaseCard } from 'components/_wizard/_cards';

const CollectionComponent = ({ collection, card, methods }) => {
    // ///////////////////
    // STORES
    // ///////////////////
    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

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

    const [updateId, setUpdateId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function addItem(formData) {
        // Modal save button state
        addModalSaving();
        try {
            // Run add method
            await methods?.add.action(formData);

            // Close modal
            addModalClose();

            // Modal save button state
            addModalNotSaving();

            // Clear content in form
            mainForm.reset();
        } catch (error) {
            // Modal save button state
            addModalNotSaving();
            console.warn(error);
        }
    }

    async function editItem(formData) {
        // Modal save button state
        editModalSaving();
        try {
            // Run edit method
            await methods?.edit.action(formData, updateId);

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

    async function deleteItem() {
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
    // DATA
    // ///////////////////

    // Preload
    const preload = !utilities.initiative.get().Id;

    // ///////////////////
    // EFFECTS
    // ///////////////////

    useEffect(() => {
        if (updateId) {
            methods.edit.setFieldValues(mainForm, updateId);
        }
    }, [updateId]);

    // ///////////////////
    // RENDER
    // ///////////////////

    const AddButton = () =>
        collection?.addLabel ? (
            <Button
                theme="teal"
                className="self-start"
                action={() => {
                    // Reset update id
                    setUpdateId(null);
                    // Clear content in form
                    mainForm.reset();
                    // Open
                    addModalOpen();
                }}>
                {collection?.addLabel}
            </Button>
        ) : null;

    return (
        <>
            <div
                style={{ willChange: 'transform opacity' }}
                className={cc([
                    'flex flex-col space-y-24 transition-slow transform pb-32',
                    {
                        'opacity-0 translate-y-48': preload,
                        'opacity-100 translate-y-0': !preload,
                    },
                ])}>
                {collection?.items.length > 0 ? (
                    <>
                        <AddButton />
                        {collection?.items.map(item => (
                            <BaseCard
                                key={item.Id}
                                {...{
                                    title: card.title(item),
                                    type: card.type(item),
                                    components: card.components(item),
                                    methods: {
                                        edit: methods?.edit
                                            ? {
                                                  action: () => {
                                                      setUpdateId(null);
                                                      mainForm.reset();
                                                      editModalOpen();
                                                      setTimeout(() => {
                                                          setUpdateId(item.Id);
                                                      }, 0);
                                                  },
                                              }
                                            : null,
                                        delete: methods?.delete
                                            ? {
                                                  action: () => {
                                                      setDeleteId(item.Id);
                                                      deleteModalOpen();
                                                  },
                                                  title: methods?.delete.title,
                                                  text: methods?.delete.text,
                                              }
                                            : null,
                                    },
                                }}
                            />
                        ))}
                    </>
                ) : (
                    <EmptyState
                        {...{
                            text: collection?.emptyLabel,
                        }}>
                        <AddButton />
                    </EmptyState>
                )}
            </div>

            {/* Add wizard */}
            {methods?.add && (
                <InputModal
                    {...{
                        form: mainForm,
                        fields: collection?.fields('add'),
                        onCancel() {
                            addModalClose();
                        },
                        async onSave() {
                            await mainForm.handleSubmit(
                                async data => await addItem(data)
                            )();
                        },
                        title: methods.add.title,
                        ...addModalState,
                    }}
                />
            )}

            {/* Edit wizard */}
            {methods?.edit && (
                <InputModal
                    {...{
                        form: mainForm,
                        fields: collection?.fields('edit'),
                        onCancel() {
                            editModalClose();
                        },
                        async onSave() {
                            await mainForm.handleSubmit(
                                async data => await editItem(data)
                            )();
                        },
                        title: methods.edit.title,
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
                            await deleteItem();
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

CollectionComponent.propTypes = {
    collection: t.shape({
        items: t.array.isRequired,
        fields: t.func,
        addLabel: t.string,
        emptyLabel: t.string.isRequired,
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
    card: t.shape({
        title: t.func.isRequired,
        type: t.func.isRequired,
        components: t.func.isRequired,
    }),
};

CollectionComponent.defaultProps = {
    collection: {
        title: '',
        items: [],
        fields: () => {},
    },
    methods: {
        add: null,
        edit: null,
        delete: null,
    },
    card: {
        title: '',
        type: '',
        components: null,
    },
};

export default CollectionComponent;
