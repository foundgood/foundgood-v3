// React
import React, { useState } from 'react';

// Packages
import cc from 'classcat';
import t from 'prop-types';

// Utilities
import { useLabels } from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import WizardModal from 'components/_modals/wizardModal';

const NoReflectionsComponent = ({ onClick, reflecting, reflectionItems }) => {
    // Hook: Metadata
    const { label } = useLabels();

    // State: Modal
    const [showModal, setShowModal] = useState(false);

    // Store: Initiative data
    const { CONSTANTS } = useInitiativeDataStore();

    const states = {
        _default() {
            return (
                <div className="flex items-center justify-between p-16 text-teal-100 border-4 border-teal-20 bg-teal-20 rounded-8">
                    <h2 className="mr-24 font-bold t-sh4">
                        {label('NothingToReportPromptHeader')}
                    </h2>
                    <Button
                        theme="teal"
                        variant="secondary"
                        className="self-end"
                        action={() => setShowModal(true)}>
                        {label('ButtonNoUpdates')}
                    </Button>
                </div>
            );
        },
        noUpdates() {
            return (
                <div className="flex flex-col p-16 border-4 border-amber-10 bg-amber-10 rounded-8 text-amber-100">
                    <h2 className="mb-8 font-bold t-sh4">
                        {label('NothingToReportStatusHeader')}
                    </h2>
                    <p className="mb-16 t-small">
                        {label('NothingToReportStatusBody')}
                    </p>
                </div>
            );
        },
        updates() {
            return (
                <div className="flex items-center justify-between p-16 text-teal-100 border-4 border-teal-20 bg-teal-20 rounded-8">
                    <p className="mb-16 t-small">
                        {label('NothingToReportUpdatesMadeStatus')}
                    </p>
                </div>
            );
        },
    };

    // Sort out all null or undefined reflections
    const realReflectionItems = Array.isArray(reflectionItems)
        ? reflectionItems.filter(item => item)
        : [];

    // Find all with no reflections
    const noReflectionItems = realReflectionItems.filter(
        item => item && item === CONSTANTS.CUSTOM.NO_REFLECTIONS
    );

    // Default: No reflectionItems
    const _default = realReflectionItems.length === 0 && !reflecting;

    // No updates: All reflectionItems === NO REFLECTION
    const noUpdates =
        realReflectionItems.length > 0 &&
        noReflectionItems.length === realReflectionItems.length &&
        !reflecting;

    // Updates: 1 or more reflectionItems exist, but not all reflectionItems === NO REFLECTION
    const updates =
        reflecting ||
        (realReflectionItems.length > 0 &&
            noReflectionItems.length !== realReflectionItems.length);

    return (
        <>
            {/* Show default state - prior to any actions */}
            {_default && states._default()}

            {/* Show no updates - after clicking "no updates" */}
            {noUpdates && states.noUpdates()}

            {/* Show updates - also when in the process of updating */}
            {updates && states.updates()}
            <WizardModal
                isOpen={showModal}
                title={label('NothingToReportModalHeader')}
                onCancel={() => setShowModal(false)}
                saveText={label('ButtonContinue')}
                onSave={() => {
                    onClick();
                    setShowModal(false);
                }}>
                <p className="t-preamble">
                    {label('NothingToReportModalBody')}
                </p>
            </WizardModal>
        </>
    );
};

NoReflectionsComponent.propTypes = {
    onClick: t.func,
    reflecting: t.bool,
    reflectionItems: t.array,
};

NoReflectionsComponent.defaultProps = {
    reflecting: false,
    reflectionItems: [],
};

export default NoReflectionsComponent;
