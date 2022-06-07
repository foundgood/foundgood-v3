// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';
import AnimateHeight from 'react-animate-height';

// Utilities
import { useContext, useLabels, useModalState } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import DeleteModal from 'components/_modals/deleteModal';
import ReportUpdate from './reportUpdate';

// Icons
import { FiTrash2, FiEdit2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const BaseCardComponent = ({
    actionDelete,
    actionEdit,
    children,
    item,
    itemRelationKey,
    reflectionType,
    reportUpdateModalTitle,
    title,
    type,
}) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { CONTEXTS, MODE } = useContext();
    const { label } = useLabels();

    // ///////////////////
    // STATE
    // ///////////////////

    const [expandedContent, setExpandedContent] = useState(false);
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();

    // ///////////////////
    // METHODS
    // ///////////////////

    function expandContent() {
        setExpandedContent(!expandedContent);
    }

    async function deleteHandler() {
        // Modal save button state
        modalSaving();

        // Do the delete
        await actionDelete();

        // Close modal
        modalClose();

        // Modal save button state
        modalNotSaving();
    }

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            <div
                className={cc([
                    'p-16 max-w-[600px] border-4 border-teal-20 rounded-8 text-teal-100 transition-default',
                ])}>
                {/* Content wrapper */}
                <div className="flex flex-col">
                    {/* Top row wrapper */}
                    <div className="flex justify-between">
                        {/* Card type */}
                        <div className="t-caption-bold text-teal-60">
                            {type}
                        </div>
                        {/* Card controls */}
                        <div className="flex h-40 space-x-8">
                            {/* Delete */}
                            {actionDelete && (
                                <Button
                                    title={label('ButtonDelete')}
                                    variant="tertiary"
                                    theme="teal"
                                    icon={FiTrash2}
                                    iconPosition="center"
                                    iconType="stroke"
                                    className="!px-8"
                                    action={modalOpen}
                                />
                            )}
                            {/* Edit */}
                            {actionEdit && (
                                <Button
                                    title={label('ButtonEdit')}
                                    variant="tertiary"
                                    theme="teal"
                                    icon={FiEdit2}
                                    iconPosition="center"
                                    iconType="stroke"
                                    className="!px-8"
                                    action={actionEdit}
                                />
                            )}
                            {/* Expand */}
                            {children && (
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
                                    action={expandContent}
                                />
                            )}
                        </div>
                    </div>

                    {/* Title wrapper */}
                    <div className="flex mt-8 text-teal-100 md:-mt-16 t-h5 md:mr-144">
                        {title}
                    </div>

                    {/* Card type content wrapper */}
                    <AnimateHeight
                        duration={300}
                        animateOpacity={true}
                        height={expandedContent ? 'auto' : 0}>
                        <div className="flex flex-col mt-16 space-y-16">
                            {children}
                        </div>
                    </AnimateHeight>

                    {/* Card child items wrapper */}
                    {/* TODO CHILD ITEMS LIKE SUCCESS METRICS */}

                    {/* Card provide report update wrapper */}
                    {MODE === CONTEXTS.REPORT && (
                        <div className="flex justify-end mt-16 space-x-8">
                            <ReportUpdate
                                {...{
                                    item,
                                    itemRelationKey,
                                    reflectionType,
                                    title: reportUpdateModalTitle,
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Delete */}
            {actionDelete && (
                <DeleteModal
                    {...{
                        onCancel() {
                            modalClose();
                        },
                        async onDelete() {
                            await deleteHandler();
                        },
                        text: deleteModalText,
                        title: deleteModalTitle,
                        ...modalState,
                    }}
                />
            )}
        </>
    );
};

BaseCardComponent.propTypes = {
    actionDelete: t.func,
    actionEdit: t.func,
    deleteModalText: t.string,
    deleteModalTitle: t.string,
    item: t.object.isRequired,
    itemRelationKey: t.string.isRequired,
    reflectionType: t.string.isRequired,
    reportUpdateModalTitle: t.string,
    title: t.string,
    type: t.string,
};

BaseCardComponent.defaultProps = {
    actionDelete: null,
    actioneEdit: null,
    deleteModalText: '',
    deleteModalTitle: '',
    item: null,
    itemRelationKey: '',
    reflectionType: '',
    reportUpdateModalTitle: '',
    title: '',
    type: '',
};

export default BaseCardComponent;
