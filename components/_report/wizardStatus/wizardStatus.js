// React
import React, { useState } from 'react';

// Packages
import { useRouter } from 'next/router';

// Utilities
import {
    useMetadata,
    useContext,
    useAuth,
    useSalesForce,
} from 'utilities/hooks';
import { useInitiativeDataStore } from 'utilities/store';

// Components
import Button from 'components/button';
import Modal from 'components/modal';

const WizardStatusComponent = () => {
    // Router
    const router = useRouter();

    // Hook: Metadata
    const { label } = useMetadata();

    // Hook: Auth
    const { userInitiativeRights } = useAuth();

    // Context for wizard pages
    const { INITIATIVE_ID, REPORT_ID } = useContext();

    // Hook: Salesforce setup
    const { sfUpdate } = useSalesForce();

    // Initiative data
    const { updateReport, utilities, CONSTANTS } = useInitiativeDataStore();

    // Current report
    const currentReport = utilities.getReport(REPORT_ID);

    // State: Modal
    const [showModal, setShowModal] = useState(false);

    // method: set report to in progress
    async function reportInProgress() {
        try {
            // Object name
            const object = 'Initiative_Report__c';

            // Data for sf
            const data = {
                Status__c: CONSTANTS.TYPES.REPORT_IN_PROGRESS,
            };

            // Update
            await sfUpdate({ object, data, id: REPORT_ID });

            // Update store
            await updateReport(REPORT_ID);

            // Change location
            router.push(`/wizard/${INITIATIVE_ID}/introduction/${REPORT_ID}`);
        } catch (error) {
            console.warn(error);
        }
    }

    // method: cmplete report
    async function completeReport() {
        try {
            // Object name
            const object = 'Initiative_Report__c';

            // Data for sf
            const data = {
                Status__c: CONSTANTS.TYPES.REPORT_IN_REVIEW,
            };

            // Update
            await sfUpdate({ object, data, id: REPORT_ID });

            // Update store
            await updateReport(REPORT_ID);

            // Close modal
            setShowModal(false);
        } catch (error) {
            console.warn(error);
        }
    }

    return (
        <>
            <div className="flex flex-col py-12 md:items-center md:justify-end md:flex-row bg-teal-20 page-px">
                <p className="flex items-center mb-12 mr-12 lg:mr-24 t-sh6 text-teal-60 md:flex md:mb-0">
                    {label('custom.FA_ReportViewReportStatus')}
                    <span className="px-8 pt-3 pb-1 mb-2 ml-8 text-blue-100 bg-blue-10 rounded-4 t-sh7">
                        {currentReport.Status__c}
                    </span>
                </p>
                {/* TODO: Out for now */}
                {/* <p className="mb-12 mr-12 lg:mr-24 t-small text-teal-60 md:flex md:mb-0 line-clamp-2">
                    <span className="mr-4 font-bold">
                        {labelTodo('6 more sections')}
                    </span>
                    <span>{labelTodo('needed before you can submit')}</span>
                </p>
                */}
                <div className="flex items-center self-end space-x-12">
                    {userInitiativeRights.canEdit &&
                        currentReport.Status__c !==
                            CONSTANTS.TYPES.REPORT_PUBLISHED && (
                            <Button
                                theme="teal"
                                variant="primary"
                                variant={
                                    [
                                        CONSTANTS.TYPES.REPORT_IN_REVIEW,
                                        CONSTANTS.TYPES.REPORT_PUBLISHED,
                                    ].includes(currentReport.Status__c)
                                        ? 'tertiary'
                                        : 'primary'
                                }
                                // SHOW/HIDE btn instead
                                // disabled={
                                //     [CONSTANTS.TYPES.REPORT_PUBLISHED].includes(
                                //         currentReport.Status__c
                                //     ) || !userInitiativeRights.canEdit
                                // }
                                action={reportInProgress}>
                                {label('custom.FA_ButtonRunWizard')}
                            </Button>
                        )}
                    {userInitiativeRights.canEdit &&
                        currentReport.Status__c !==
                            CONSTANTS.TYPES.REPORT_PUBLISHED && (
                            <Button
                                theme="teal"
                                variant={
                                    currentReport.Status__c ===
                                    CONSTANTS.TYPES.REPORT_NOT_STARTED
                                        ? 'tertiary'
                                        : 'primary'
                                }
                                disabled={
                                    currentReport.Status__c ===
                                    CONSTANTS.TYPES.REPORT_IN_REVIEW
                                }
                                action={() => setShowModal(true)}>
                                {label('custom.FA_ButtonSubmit')}
                            </Button>
                        )}
                </div>
            </div>
            <Modal
                isOpen={showModal}
                title={label('custom.FA_ModalReportCompleteHeader')}
                onCancel={() => setShowModal(false)}
                saveText={label('custom.FA_ButtonSubmit')}
                onSave={() => {
                    completeReport();
                }}>
                <p className="t-preamble">
                    {label('custom.FA_ModalReportCompleteBody')}
                </p>
            </Modal>
        </>
    );
};

WizardStatusComponent.propTypes = {};

WizardStatusComponent.defaultProps = {};

export default WizardStatusComponent;
