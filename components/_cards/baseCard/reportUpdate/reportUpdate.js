// React
import React from 'react';

// Packages
import t from 'prop-types';
import { useForm } from 'react-hook-form';

// Utilities
import {
    useContext,
    useElseware,
    useLabels,
    useModalState,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import ReportUpdateModal from 'components/_modals/reportUpdateModal';

// Icons
import { FiTrendingUp, FiMessageCircle } from 'react-icons/fi';

const ReportUpdateComponent = ({
    item,
    itemRelationKey,
    reflectionType,
    title,
}) => {
    // ///////////////////
    // STORES
    // ///////////////////

    const { utilities } = useInitiativeDataStore();

    // ///////////////////
    // HOOKS
    // ///////////////////

    const { REPORT_ID } = useContext();
    const { label } = useLabels();
    const { ewCreateUpdateWrapper } = useElseware();
    const {
        modalState,
        modalOpen,
        modalClose,
        modalSaving,
        modalNotSaving,
    } = useModalState();

    // ///////////////////
    // FORMS
    // ///////////////////

    const mainForm = useForm();

    // ///////////////////
    // METHODS
    // ///////////////////

    async function submit(formData) {
        // Modal save button state
        modalSaving();
        try {
            const { reflectionDescription } = formData;

            // Tags
            // TODO

            // Status
            // TODO

            // Success Metrics
            // TODO

            console.log(reflection);

            // Create/Update reflection
            await ewCreateUpdateWrapper(
                'initiative-report-detail/initiative-report-detail',
                reflection?.Id,
                {
                    Description__c: reflectionDescription,
                },
                {
                    [itemRelationKey]: item.Id,
                    Type__c: reflectionType,
                    Initiative_Report__c: REPORT_ID,
                },
                '_reportDetails'
            );

            // Close modal
            modalClose();

            // Modal save button state
            modalNotSaving();

            // Clear content in form
            mainForm.reset();
        } catch (error) {
            // Modal save button state
            modalNotSaving();
            console.warn(error);
        }
    }

    // ///////////////////
    // DATA
    // ///////////////////

    // Current report details (reflections)
    const reportDetails = utilities.reportDetails.getFromReportId(REPORT_ID);

    // Get current reflection based on itemRelationKey if any
    const reflection = reportDetails.find(
        reportDetail => reportDetail[itemRelationKey] === item.Id
    );

    // Any updates?
    const hasUpdate = [reflection].some(x => x);

    // ///////////////////
    // RENDER
    // ///////////////////

    return (
        <>
            {/* Show updates if they are there */}
            {hasUpdate ? (
                <div className="flex justify-between w-full p-8 rounded-8 bg-blue-20">
                    <div className="flex items-center px-8 space-x-12 text-blue-300">
                        {reflection && (
                            <FiMessageCircle className="w-24 h-24" />
                        )}
                    </div>
                    <Button variant="secondary" theme="blue" action={modalOpen}>
                        {label('ButtonEdit')}
                    </Button>
                </div>
            ) : (
                <Button variant="secondary" theme="teal" action={modalOpen}>
                    {label('BaseCardButtonUpdateReport')}
                </Button>
            )}

            <ReportUpdateModal
                {...{
                    title,
                    form: mainForm,
                    reflection,
                    onCancel() {
                        modalClose();
                    },
                    async onSave() {
                        await mainForm.handleSubmit(
                            async data => await submit(data)
                        )();
                    },
                    ...modalState,
                }}
            />
        </>
    );
};

ReportUpdateComponent.propTypes = {
    item: t.object.isRequired,
    itemRelationKey: t.string.isRequired,
    reflectionType: t.string.isRequired,
    title: t.string,
};

ReportUpdateComponent.defaultProps = {
    item: null,
    itemRelationKey: '',
    reflectionType: '',
    title: '',
};

export default ReportUpdateComponent;
