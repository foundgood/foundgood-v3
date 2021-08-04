// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useMetadata } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import Modal from 'components/modal';

const NoReflectionsComponent = ({ onClick, updating, reflectionItems }) => {
    // Hook: Metadata
    const { label } = useMetadata();

    // State: Modal
    const [showModal, setShowModal] = useState(false);

    // Store: Initiative data
    const { CONSTANTS } = useInitiativeDataStore();

    const states = {
        _default() {
            return (
                <div className="flex items-center justify-between p-16 text-teal-100 border-4 border-teal-20 bg-teal-20 rounded-8">
                    <h2 className="mr-24 font-bold t-sh4">
                        {label('custom.FA_NothingToReportPromptHeader')}
                    </h2>
                    <Button
                        theme="teal"
                        variant="secondary"
                        className="self-end"
                        action={() => setShowModal(true)}>
                        {label('custom.FA_ButtonNoUpdates')}
                    </Button>
                </div>
            );
        },
        noUpdates() {
            return (
                <div className="flex flex-col p-16 border-4 border-amber-10 bg-amber-10 rounded-8 text-amber-100">
                    <h2 className="mb-8 font-bold t-sh4">
                        {label('custom.FA_NothingToReportStatusHeader')}
                    </h2>
                    <p className="mb-16 t-small">
                        {label('custom.FA_NothingToReportStatusBody')}
                    </p>
                </div>
            );
        },
        updates() {
            return (
                <div className="flex items-center justify-between p-16 text-teal-100 border-4 border-teal-20 bg-teal-20 rounded-8">
                    <p className="mb-16 t-small">
                        {label('custom.FA_NothingToReportUpdatesMadeStatus')}
                    </p>
                </div>
            );
        },
    };

    // Sort out all null or undefined reflections
    const realReflectionItems = reflectionItems.filter(item => item);

    // Find all with no reflections
    const noReflectionItems = realReflectionItems.filter(
        item => item && item === CONSTANTS.CUSTOM.NO_REFLECTIONS
    );

    // Default: No reflectionItems
    const _default = realReflectionItems.length === 0;

    // No updates: All reflectionItems === NO REFLECTION
    const noUpdates =
        realReflectionItems.length > 0 &&
        noReflectionItems.length === realReflectionItems.length;

    // Updates: 1 or more reflectionItems exist, but not all reflectionItems === NO REFLECTION
    const updates =
        realReflectionItems.length > 0 &&
        noReflectionItems.length !== realReflectionItems.length;

    return (
        <>
            {/* Show default state - prior to any actions */}
            {_default && states._default()}

            {/* Show no updates - after clicking "no updates" */}
            {noUpdates && states.noUpdates()}

            {/* Show updates - also when in the process of updating */}
            {updates && states.updates()}
            <Modal
                isOpen={showModal}
                title={label('custom.FA_NothingToReportModalHeader')}
                onCancel={() => setShowModal(false)}
                saveText={label('custom.FA_ButtonContinue')}
                onSave={() => {
                    onClick();
                    setShowModal(false);
                }}>
                <p className="t-preamble">
                    {label('custom.FA_NothingToReportModalBody')}
                </p>
            </Modal>
        </>
    );
};

NoReflectionsComponent.propTypes = {
    onClick: t.func,
    noUpdates: t.bool,
    updates: t.bool,
    reflectionItems: t.array,
};

NoReflectionsComponent.defaultProps = {
    noUpdates: false,
    updates: false,
    reflectionItems: [],
};

export default NoReflectionsComponent;
